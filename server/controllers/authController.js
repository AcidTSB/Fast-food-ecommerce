import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/mysql-connection.js';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      fullName: user.full_name 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', email);

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role = "admin"',
      [email]
    );
    console.log('Admin login users:', users);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }
    
    // Tạo token
    const token = generateToken(user);
    
    // Không trả về password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message
    });
  }
};

// User login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }
    
    // Tìm user trong database
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }
    
    const user = users[0];
    
    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }
    
    // Tạo token
    const token = generateToken(user);
    
    // Không trả về password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('❌ User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message
    });
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const [result] = await db.query(
      'INSERT INTO users (email, password, full_name, phone, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone || '', 'customer', false]
    );

    // Lấy user vừa tạo
    const [newUserRows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const newUser = newUserRows[0];

    // Tạo token
    const token = generateToken(newUser);

    // Không trả về password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message
    });
  }
};

// Verify token
export const verifyToken = async (req, res) => {
  try {
    // Token đã được verify trong middleware auth
    const { password: _, ...userWithoutPassword } = req.user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('❌ Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực token'
    });
  }
};