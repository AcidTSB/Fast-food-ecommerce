import db from '../config/mysql-connection.js';

async function fixProductsTable() {
  try {
    console.log('🔧 Fixing products table structure...');
    
    // Kiểm tra cấu trúc hiện tại
    const [columns] = await db.query('DESCRIBE products');
    const existingColumns = columns.map(col => col.Field);
    console.log('📋 Existing columns:', existingColumns);
    
    // Định nghĩa các cột cần thiết
    const requiredColumns = {
      'image': 'VARCHAR(500)',
      'sale_price': 'DECIMAL(10, 2)',
      'is_featured': 'BOOLEAN DEFAULT FALSE',
      'is_available': 'BOOLEAN DEFAULT TRUE',
      'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
    };
    
    // Thêm từng cột còn thiếu
    for (const [columnName, columnDefinition] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(columnName)) {
        console.log(`➕ Adding column: ${columnName}`);
        await db.query(`ALTER TABLE products ADD COLUMN ${columnName} ${columnDefinition}`);
        console.log(`✅ Added ${columnName}`);
      } else {
        console.log(`ℹ️  Column ${columnName} already exists`);
      }
    }
    
    // Kiểm tra lại cấu trúc sau khi thêm
    const [newColumns] = await db.query('DESCRIBE products');
    console.log('🎉 Updated products table structure:');
    newColumns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(required)'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing products table:', error);
  } finally {
    await db.end();
    process.exit();
  }
}

fixProductsTable();