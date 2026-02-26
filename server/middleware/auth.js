import jwt from 'jsonwebtoken';
import db from '../config/mysql-connection.js';

export const auth = async (req, res, next) => {
  try {
    console.log('🔑 Auth middleware checking token');
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified:', { userId: decoded.id, role: decoded.role });
      
      // Get user info from database
      const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
      
      // Thêm debug
      console.log(`🔎 Searching for user ID: ${decoded.id}`);
      console.log(`📊 Found ${users.length} matching users`);
      
      if (users.length === 0) {
        console.log(`❌ User not found: ${decoded.id}`);
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      req.user = {
        userId: users[0].id,
        email: users[0].email,
        role: users[0].role,
        name: users[0].full_name
      };
      console.log('🧾 users[0] from DB:', users[0]);
      console.log(`✅ User authenticated: ${users[0].full_name} (${users[0].role})`);
      next();
    } catch (jwtError) {
      console.log('❌ Invalid token:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token. ' + jwtError.message
      });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      console.log('🔒 Admin check for user:', req.user);
      
      if (!req.user || req.user.role !== 'admin') {
        console.log(`❌ User role is not admin: ${req.user?.role || 'undefined'}`);
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin role required.'
        });
      }
      
      console.log('✅ Admin access granted');
      next();
    });
  } catch (error) {
    console.error('❌ Admin auth error:', error);
    res.status(500).json({
      success: false, 
      message: 'Server error during admin authentication.'
    });
  }
};

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

    // Lấy lại thông tin user sau khi update
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
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật profile'
    });
  }
};