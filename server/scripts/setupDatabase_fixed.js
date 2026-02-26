import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🚀 FastFood Database Setup (Improved SQL Parser)');
    console.log('═'.repeat(60));
    console.log('🔍 Connecting to MySQL server...');
    
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL server');
    console.log(`📍 Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    
    // Read SQL dump file
    console.log('\n📂 Reading SQL dump file...');
    const sqlFilePath = path.join(__dirname, '../database/schema_fixed.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL dump file not found: ${sqlFilePath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL dump file loaded successfully');
    console.log(`📄 File size: ${(fs.statSync(sqlFilePath).size / 1024).toFixed(2)} KB`);
    
    // Enhanced SQL content cleaning
    console.log('\n🧹 Cleaning and parsing SQL content...');
    
    // Split content into lines for better processing
    const lines = sqlContent.split('\n');
    const cleanedLines = [];
    let insideComment = false;
    
    for (let line of lines) {
      line = line.trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Skip MySQL dump comments and settings
      if (line.startsWith('/*!') || 
          line.startsWith('--') || 
          line.startsWith('/*') ||
          line.match(/^SET\s+(@OLD_|NAMES|TIME_ZONE|.*_CHECKS|.*_MODE|.*_NOTES)/i) ||
          line.match(/^(LOCK|UNLOCK)\s+TABLES/i)) {
        continue;
      }
      
      // Handle multi-line comments
      if (line.includes('/*') && !line.includes('*/')) {
        insideComment = true;
        continue;
      }
      if (insideComment && line.includes('*/')) {
        insideComment = false;
        continue;
      }
      if (insideComment) {
        continue;
      }
      
      // Clean inline comments but preserve SQL
      line = line.replace(/\/\*.*?\*\//g, '');
      line = line.replace(/--.*$/, '');
      line = line.trim();
      
      if (line) {
        cleanedLines.push(line);
      }
    }
    
    const cleanedSql = cleanedLines.join('\n');
    console.log(`🔧 Cleaned SQL: ${cleanedLines.length} lines processed`);
    
    // Split into individual statements more carefully
    const statements = [];
    let currentStatement = '';
    let insideString = false;
    let stringChar = '';
    
    for (let i = 0; i < cleanedSql.length; i++) {
      const char = cleanedSql[i];
      const prevChar = i > 0 ? cleanedSql[i - 1] : '';
      
      if (!insideString && (char === '"' || char === "'")) {
        insideString = true;
        stringChar = char;
      } else if (insideString && char === stringChar && prevChar !== '\\') {
        insideString = false;
        stringChar = '';
      }
      
      currentStatement += char;
      
      if (!insideString && char === ';') {
        const stmt = currentStatement.trim();
        if (stmt && stmt !== ';') {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    // Add remaining statement if any
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    // Execute statements individually with better error handling
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (!statement || statement === ';') continue;
      
      try {
        // Skip problematic statements
        if (statement.match(/^(SET|LOCK|UNLOCK)/i)) {
          skipCount++;
          continue;
        }
        
        await connection.query(statement);
        successCount++;
        
        // Log important operations
        if (statement.toUpperCase().includes('CREATE DATABASE')) {
          console.log('  ✓ Database created');
        } else if (statement.toUpperCase().includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE.*?`?(\w+)`?/i)?.[1] || 'unknown';
          console.log(`  ✓ Table created: ${tableName}`);
        } else if (statement.toUpperCase().includes('INSERT INTO')) {
          const tableName = statement.match(/INSERT INTO.*?`?(\w+)`?/i)?.[1] || 'unknown';
          // Count the number of VALUES entries
          const valuesCount = (statement.match(/\),\s*\(/g) || []).length + 1;
          console.log(`  ✓ Data inserted: ${tableName} (${valuesCount} records)`);
        }
        
      } catch (stmtError) {
        if (stmtError.message.includes('already exists') || 
            stmtError.message.includes('Duplicate entry')) {
          skipCount++;
          if (statement.toUpperCase().includes('CREATE TABLE')) {
            const tableName = statement.match(/CREATE TABLE.*?`?(\w+)`?/i)?.[1] || 'unknown';
            console.log(`  ⏭️  Skipped (exists): ${tableName}`);
          }
        } else {
          errorCount++;
          console.warn(`  ⚠️  Error (${i + 1}/${statements.length}): ${stmtError.message.substring(0, 100)}...`);
          
          // For debugging, show the problematic statement
          if (errorCount <= 3) {
            console.warn(`     Statement: ${statement.substring(0, 100)}...`);
          }
        }
      }
    }
    
    console.log(`\n📈 Execution Summary:`);
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);
    console.log(`  ⚠️  Errors: ${errorCount}`);
    
    // Connect to the specific database
    const dbName = process.env.DB_NAME || 'fastfood_db';
    console.log(`\n🔄 Switching to database: ${dbName}`);
    
    try {
      await connection.query(`USE \`${dbName}\``);
      console.log('✅ Successfully connected to fastfood_db');
    } catch (error) {
      console.warn('⚠️  Could not switch to database:', error.message);
      // Try to create the database if it doesn't exist
      try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await connection.query(`USE \`${dbName}\``);
        console.log('✅ Database created and connected');
      } catch (createError) {
        console.error('❌ Could not create database:', createError.message);
      }
    }
    
    // Enhanced database verification
    console.log('\n🧪 Database verification...');
    
    const expectedTables = [
      'categories',
      'products', 
      'users',
      'orders',
      'order_items',
      'cart_items'
    ];
    
    console.log('📊 Table statistics:');
    let totalRecords = 0;
    const tableStats = {};
    
    for (const table of expectedTables) {
      try {
        // Check if table exists
        const [tableCheck] = await connection.query(`
          SELECT COUNT(*) as exists_check 
          FROM information_schema.tables 
          WHERE table_schema = ? AND table_name = ?
        `, [dbName, table]);
        
        if (tableCheck[0].exists_check > 0) {
          const [result] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
          const count = result[0].count;
          tableStats[table] = count;
          totalRecords += count;
          console.log(`  📋 ${table.padEnd(15)}: ${count} records`);
        } else {
          console.log(`  ❌ ${table.padEnd(15)}: Table missing`);
        }
      } catch (error) {
        console.log(`  ❌ ${table.padEnd(15)}: Error - ${error.message}`);
      }
    }
    
    console.log(`\n📊 Total records: ${totalRecords}`);
    
    // Test complex queries if we have data
    if (tableStats.categories > 0 && tableStats.products > 0) {
      try {
        const [testResult] = await connection.query(`
          SELECT 
            c.name as category_name,
            COUNT(p.id) as product_count,
            AVG(p.price) as avg_price
          FROM categories c
          LEFT JOIN products p ON c.id = p.category_id
          WHERE c.is_active = 1
          GROUP BY c.id, c.name
          ORDER BY c.display_order
        `);
        
        console.log('\n📈 Category breakdown:');
        testResult.forEach(row => {
          const avgPrice = row.avg_price ? `${Math.round(row.avg_price).toLocaleString()}đ avg` : 'no products';
          console.log(`  🏷️  ${row.category_name}: ${row.product_count} products (${avgPrice})`);
        });
      } catch (error) {
        console.warn('⚠️  Could not run test query:', error.message);
      }
    }
    
    // Check for admin user
    if (tableStats.users > 0) {
      try {
        const [adminCheck] = await connection.query(`
          SELECT email, full_name, role 
          FROM users 
          WHERE role = 'admin' 
          LIMIT 1
        `);
        
        if (adminCheck.length > 0) {
          console.log(`\n👤 Admin user found: ${adminCheck[0].email} (${adminCheck[0].full_name})`);
        }
      } catch (error) {
        console.warn('⚠️  Could not check admin user:', error.message);
      }
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('═'.repeat(60));
    console.log('✨ Your FastFood database is ready!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:5000');
    console.log('   3. Admin login: admin@fastfood.com');
    console.log('   4. Admin password: password (default)');
    console.log('\n💡 Tips:');
    console.log('   • Change admin password after first login');
    console.log('   • Check .env file for database configuration');
    console.log('   • Run this script again if you need to reset data');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    
    // Enhanced error diagnosis
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 ACCESS DENIED - Solutions:');
      console.log('   1. Check MySQL username/password in .env file');
      console.log('   2. Verify MySQL user privileges:');
      console.log('      mysql -u root -p');
      console.log('      GRANT ALL PRIVILEGES ON *.* TO \'root\'@\'localhost\';');
      console.log('   3. Try resetting MySQL root password');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 CONNECTION REFUSED - Solutions:');
      console.log('   Windows: net start mysql80 (or mysql)');
      console.log('   macOS: brew services start mysql');
      console.log('   Linux: sudo systemctl start mysql');
      console.log('   Check port 3306 is not blocked by firewall');
    } else if (error.code === 'ENOENT') {
      console.log('\n🔧 FILE NOT FOUND - Solutions:');
      console.log('   1. Ensure schema_fixed.sql exists in database/ folder');
      console.log('   2. Check file path and permissions');
      console.log('   3. Current working directory:', process.cwd());
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n🔧 DATABASE ERROR - Solutions:');
      console.log('   1. This is normal for first run (database will be created)');
      console.log('   2. Check database name in .env file');
      console.log('   3. Verify MySQL user has CREATE DATABASE privilege');
    }
    
    console.log('\n🔍 Debug information:');
    console.log(`   Node.js: ${process.version}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Error Code: ${error.code || 'Unknown'}`);
    console.log(`   SQL State: ${error.sqlState || 'N/A'}`);
    console.log(`   Error Number: ${error.errno || 'N/A'}`);
    console.log(`   Working Directory: ${process.cwd()}`);
    
    process.exit(1);
  } finally {
    if (connection) {
      console.log('\n🔌 Closing database connection...');
      await connection.end();
    }
  }
}

// Enhanced error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:');
  console.error('   At:', promise);
  console.error('   Reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('   Stack:', error.stack);
  process.exit(1);
});

// Add signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Setup interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Setup terminated');
  process.exit(0);
});

setupDatabase();