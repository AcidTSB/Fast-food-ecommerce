const db = require('../config/database');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1, notes } = req.body;
    const userId = req.user?.userId;
    const sessionId = req.sessionID || req.headers['session-id'];
    
    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Cần session ID để lưu giỏ hàng'
      });
    }
    
    // Kiểm tra sản phẩm có tồn tại không
    const [products] = await db.execute(
      'SELECT id, name, price FROM products WHERE id = ? AND is_available = 1',
      [product_id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      });
    }
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    let existingQuery = 'SELECT * FROM cart_items WHERE product_id = ?';
    let existingParams = [product_id];
    
    if (userId) {
      existingQuery += ' AND user_id = ?';
      existingParams.push(userId);
    } else {
      existingQuery += ' AND session_id = ?';
      existingParams.push(sessionId);
    }
    
    const [existingItems] = await db.execute(existingQuery, existingParams);
    
    if (existingItems.length > 0) {
      // Cập nhật số lượng
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ?, notes = ?, updated_at = NOW() WHERE id = ?',
        [quantity, notes, existingItems[0].id]
      );
    } else {
      // Thêm mới
      await db.execute(
        'INSERT INTO cart_items (user_id, session_id, product_id, quantity, notes) VALUES (?, ?, ?, ?, ?)',
        [userId, sessionId, product_id, quantity, notes]
      );
    }
    
    res.json({
      success: true,
      message: 'Đã thêm vào giỏ hàng'
    });
    
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm vào giỏ hàng'
    });
  }
};

// Lấy giỏ hàng
const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['session-id'];
    
    if (!userId && !sessionId) {
      return res.json({
        success: true,
        data: { items: [], total: 0 }
      });
    }
    
    let query = `
      SELECT 
        ci.*,
        p.name as product_name,
        p.price as product_price,
        p.images as product_images,
        p.short_description
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE p.is_available = 1
    `;
    let params = [];
    
    if (userId) {
      query += ' AND ci.user_id = ?';
      params.push(userId);
    } else {
      query += ' AND ci.session_id = ?';
      params.push(sessionId);
    }
    
    query += ' ORDER BY ci.created_at DESC';
    
    const [items] = await db.execute(query, params);
    
    // Tính tổng tiền
    let total = 0;
    const cartItems = items.map(item => {
      const itemTotal = item.product_price * item.quantity;
      total += itemTotal;
      
      let images = item.product_images;
      try {
        if (typeof images === 'string') {
          images = JSON.parse(images);
        }
      } catch (e) {
        images = [item.product_images];
      }
      
      return {
        ...item,
        product_images: images,
        product_image: images && images.length > 0 ? images[0] : null,
        item_total: itemTotal
      };
    });
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total,
        item_count: cartItems.length
      }
    });
    
  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy giỏ hàng'
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.userId;
    const sessionId = req.headers['session-id'];
    
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }
    
    let query = 'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?';
    let params = [quantity, id];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    } else if (sessionId) {
      query += ' AND session_id = ?';
      params.push(sessionId);
    }
    
    const [result] = await db.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật giỏ hàng thành công'
    });
    
  } catch (error) {
    console.error('❌ Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật giỏ hàng'
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const sessionId = req.headers['session-id'];
    
    let query = 'DELETE FROM cart_items WHERE id = ?';
    let params = [id];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    } else if (sessionId) {
      query += ' AND session_id = ?';
      params.push(sessionId);
    }
    
    const [result] = await db.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm trong giỏ hàng'
      });
    }
    
    res.json({
      success: true,
      message: 'Đã xóa khỏi giỏ hàng'
    });
    
  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khỏi giỏ hàng'
    });
  }
};

// Xóa toàn bộ giỏ hàng
const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const sessionId = req.headers['session-id'];
    
    let query = 'DELETE FROM cart_items WHERE ';
    let params = [];
    
    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else if (sessionId) {
      query += 'session_id = ?';
      params.push(sessionId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa giỏ hàng'
      });
    }
    
    await db.execute(query, params);
    
    res.json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng'
    });
    
  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa giỏ hàng'
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};