const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { mysqlPool } = require('../config/database');

// Helper function để tạo JWT token
const generateToken = (userId) => {
  const payload = { userId };
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const options = { expiresIn: '7d' };
  
  console.log('🔑 Generating token for user:', userId);
  const token = jwt.sign(payload, secret, options);
  console.log('✅ Token generated:', token ? `${token.substring(0, 20)}...` : 'null');
  
  return token;
};

// Đăng ký người dùng mới
const register = async (req, res) => {
  try {
    console.log('📥 Raw request body:', req.body);
    console.log('📥 Request headers:', req.headers);
    
    const { email, password, fullName, phone } = req.body;
    
    console.log('📋 Extracted fields:', {
      email: email || 'MISSING',
      password: password ? '[PROVIDED]' : 'MISSING',
      fullName: fullName || 'MISSING',
      phone: phone || 'NOT PROVIDED'
    });

    // Validate input
    if (!email || !password || !fullName) {
      console.log('❌ Validation failed:', {
        hasEmail: !!email,
        hasPassword: !!password,
        hasFullName: !!fullName
      });
      
      return res.status(400).json({
        success: false,
        message: 'Email, mật khẩu và họ tên là bắt buộc'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Kiểm tra email đã tồn tại
    const [existingUsers] = await mysqlPool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔒 Password hashed successfully');

    // Tạo người dùng mới
    const [result] = await mysqlPool.execute(
      'INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, fullName, phone || null, 'customer']
    );

    const userId = result.insertId;
    console.log('✅ User created with ID:', userId);

    // Lấy thông tin user vừa tạo
    const [users] = await mysqlPool.execute(
      'SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];

    // Tạo token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Tìm người dùng
    const [users] = await mysqlPool.execute(
      'SELECT id, email, password, full_name, phone, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      console.log('❌ User account is inactive:', email);
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Kiểm tra mật khẩu
    console.log('🔍 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    console.log('✅ Password verified for user:', email);

    // Tạo token
    const token = generateToken(user.id);

    console.log('✅ Login successful for user:', email);

    // Trả về response với đúng format
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Lấy thông tin profile
const getProfile = async (req, res) => {
  try {
    console.log('🔍 Getting profile for user ID:', req.user.userId);
    
    const [users] = await mysqlPool.execute(
      'SELECT id, email, full_name, phone, avatar, date_of_birth, gender, role, loyalty_points, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        role: user.role,
        loyaltyPoints: user.loyalty_points,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cập nhật profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dateOfBirth, gender } = req.body;

    // Lấy thông tin user hiện tại
    const [users] = await mysqlPool.execute(
      'SELECT full_name, phone, date_of_birth, gender FROM users WHERE id = ?',
      [req.user.userId]
    );
    const current = users[0];

    // Nếu client không gửi, giữ lại giá trị cũ
    let newFullName = fullName !== undefined ? fullName : current.full_name;
    let newPhone = phone !== undefined ? phone : current.phone;
    let newDateOfBirth = dateOfBirth !== undefined ? dateOfBirth : current.date_of_birth;
    let newGender = gender !== undefined ? gender : current.gender;

    // Nếu full_name vẫn là null, undefined hoặc chuỗi rỗng, trả về lỗi
    if (!newFullName || newFullName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Họ tên không được để trống."
      });
    }

    await mysqlPool.execute(
      'UPDATE users SET full_name = ?, phone = ?, date_of_birth = ?, gender = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newFullName, newPhone, newDateOfBirth, newGender, req.user.userId]
    );

    // Lấy thông tin user sau khi update
    const [updatedUsers] = await mysqlPool.execute(
      'SELECT id, email, full_name, phone, avatar, date_of_birth, gender, role, loyalty_points FROM users WHERE id = ?',
      [req.user.userId]
    );

    const user = updatedUsers[0];

    res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        role: user.role,
        loyaltyPoints: user.loyalty_points
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Lấy tất cả người dùng (dành cho admin)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await mysqlPool.query('SELECT * FROM users WHERE role != "admin"');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
};