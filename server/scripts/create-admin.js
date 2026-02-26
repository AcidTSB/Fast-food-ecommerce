import bcrypt from 'bcryptjs';
import db from '../config/mysql-connection.js';

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');
    
    const email = 'admin@fastfood.com';
    const password = 'admin123456';
    const fullName = 'Quản Trị Viên';
    const phone = '0901234567';
    
    // Hash password đúng cách
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔒 Password hashed successfully');
    
    // Xóa admin cũ nếu có
    await db.execute('DELETE FROM users WHERE email = ?', [email]);
    console.log('🗑️  Removed existing admin user');
    
    // Tạo admin mới
    const [result] = await db.execute(
      'INSERT INTO users (email, password, full_name, phone, role, email_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, fullName, phone, 'admin', true, true]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 ID:', result.insertId);
    
    // Test login
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    console.log('🧪 Password verification test:', isPasswordValid ? '✅ PASS' : '❌ FAIL');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();