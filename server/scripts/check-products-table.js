import db from '../config/mysql-connection.js';

async function checkProductsTable() {
  try {
    console.log('🔍 Checking products table structure...');
    
    // Kiểm tra cấu trúc bảng hiện tại
    const [columns] = await db.query('DESCRIBE products');
    console.log('📋 Current products table structure:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(required)'} ${col.Default ? `(default: ${col.Default})` : ''}`);
    });
    
    // Kiểm tra các cột cần thiết
    const requiredColumns = ['image', 'sale_price', 'is_featured', 'is_available', 'created_at', 'updated_at'];
    const existingColumns = columns.map(col => col.Field);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns);
    } else {
      console.log('✅ All required columns exist');
    }
    
  } catch (error) {
    console.error('❌ Error checking table:', error);
  } finally {
    await db.end();
    process.exit();
  }
}

checkProductsTable();