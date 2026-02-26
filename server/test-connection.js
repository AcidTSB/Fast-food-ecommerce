const db = require('./config/database');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const connection = await db.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    
    // Test query
    const [result] = await db.execute('SELECT 1 as test');
    console.log('✅ Database query test:', result);
    
    // Test products table
    const [products] = await db.execute('SELECT COUNT(*) as count FROM products');
    console.log('✅ Products count:', products[0].count);
    
    // Test categories table
    const [categories] = await db.execute('SELECT COUNT(*) as count FROM categories');
    console.log('✅ Categories count:', categories[0].count);
    
    console.log('🎉 All tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testConnection();