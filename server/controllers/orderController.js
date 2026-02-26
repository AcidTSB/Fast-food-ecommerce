import db from '../config/mysql-connection.js';

export const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    console.log('📥 [createOrder] Nhận request tạo đơn hàng');
    console.log('📥 [createOrder] req.user:', req.user);
    console.log('📥 [createOrder] req.body:', req.body);

    await connection.beginTransaction();
    console.log('🔁 [createOrder] Bắt đầu transaction');

    const {
      items,
      customer,
      delivery_notes,
      payment_method
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Danh sách sản phẩm trống');
    }

    const userId = req.user?.userId || null;
    if (!userId) {
      throw new Error('Không có userId trong req.user');
    }

    const delivery_name = customer?.name || '';
    const delivery_phone = customer?.phone || '';
    const delivery_address = customer?.address || '';

    // Tính tổng tiền
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      console.log('🔍 [createOrder] Đang xử lý item:', item);
      const [products] = await connection.execute(
        'SELECT id, name, price, sale_price, image FROM products WHERE id = ? AND is_available = 1',
        [item.product_id]
      );

      if (products.length === 0) {
        throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại hoặc không khả dụng`);
      }

      const product = products[0];
      const finalPrice = product.sale_price || product.price;
      const itemTotal = finalPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        price: finalPrice,
        quantity: item.quantity,
        total: itemTotal,
        notes: item.notes || null
      });
    }

    const delivery_fee = subtotal >= 200000 ? 0 : 25000;
    const total_amount = subtotal + delivery_fee;
    const order_number = `FF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    console.log('🧾 [createOrder] Thông tin đơn hàng sẽ insert:', {
      userId,
      order_number,
      delivery_name,
      delivery_phone,
      delivery_address,
      delivery_notes,
      subtotal,
      delivery_fee,
      total_amount,
      payment_method
    });

    const [orderResult] = await connection.execute(`
      INSERT INTO orders (
        user_id, order_number,
        delivery_name, delivery_phone, delivery_address,
        delivery_notes, subtotal, delivery_fee, total_amount,
        payment_method, status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `, [
      userId, order_number,
      delivery_name, delivery_phone, delivery_address,
      delivery_notes, subtotal, delivery_fee, total_amount,
      payment_method
    ]);

    const orderId = orderResult.insertId;
    console.log('✅ [createOrder] Đã insert đơn hàng với ID:', orderId);

    for (const item of orderItems) {
      await connection.execute(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_image,
          price, quantity, total, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderId, item.product_id, item.product_name, item.product_image,
        item.price, item.quantity, item.total, item.notes
      ]);
      console.log(`🛒 [createOrder] Đã thêm item: ${item.product_name}`);
    }

    await connection.commit();
    console.log('💾 [createOrder] Commit thành công');

    // Xoá giỏ hàng
    if (userId) {
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);
      console.log('🧹 [createOrder] Đã xoá giỏ hàng người dùng');
    }

    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: {
        order_id: orderId,
        order_number,
        total_amount,
        status: 'pending'
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ [createOrder] Lỗi tạo đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi không xác định khi tạo đơn hàng'
    });
  } finally {
    connection.release();
  }
};


// Get all orders for a user
export const getUserOrders = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.userId;
    const { status, limit = 10, offset = 0 } = req.query;
    const limitNum = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
    const offsetNum = Number.isInteger(Number(offset)) && Number(offset) >= 0 ? Number(offset) : 0;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Missing userId'
      });
    }

    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (status && status !== 'all') {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    query += ` 
      GROUP BY o.id 
      ORDER BY o.created_at DESC 
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    const [orders] = await connection.execute(query, params);

    // Lấy items cho từng đơn hàng
    for (const order of orders) {
      const [items] = await connection.execute(
        'SELECT * FROM order_items WHERE order_id = ?', [order.id]
      );
      order.items = items;
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('❌ Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders'
    });
  } finally {
    connection.release();
  }
};

// Get order by ID with details (Admin + User)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    console.log('📋 Getting order by ID:', id);

    // Get order info
    let orderQuery = `
      SELECT 
        o.*,
        u.full_name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    const orderParams = [id];

    // If not admin, only get the order of that user
    if (req.user?.role !== 'admin' && userId) {
      orderQuery += ' AND o.user_id = ?';
      orderParams.push(userId);
    }

    const [orders] = await db.query(orderQuery, orderParams);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Get order items
    const [items] = await db.query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.image as product_image,
        p.slug as product_slug
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `, [id]);

    const orderData = {
      ...orders[0],
      items: items
    };

    console.log('📦 Order details retrieved');

    res.json({
      success: true,
      data: orderData
    });

  } catch (error) {
    console.error('❌ Error getting order by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết đơn hàng',
      error: error.message
    });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    console.log('🔄 Updating order status:', { id, status, notes });

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái đơn hàng không hợp lệ'
      });
    }

    // Check if order exists
    const [existingOrder] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Update order status
    const updateQuery = notes 
      ? 'UPDATE orders SET status = ?, delivery_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      : 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    const updateParams = notes ? [status, notes, id] : [status, id];
    
    await db.query(updateQuery, updateParams);

    // Get updated order
    const [updatedOrder] = await db.query(`
      SELECT 
        o.*,
        u.full_name as user_name,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    console.log('✅ Order status updated successfully');

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updatedOrder[0]
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái đơn hàng',
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;

    // Kiểm tra đơn hàng có tồn tại và thuộc về user không
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]
    );
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Chỉ cho phép huỷ nếu trạng thái là pending hoặc processing
    if (!['pending', 'processing'].includes(orders[0].status)) {
      return res.status(400).json({ success: false, message: 'Không thể huỷ đơn hàng ở trạng thái hiện tại' });
    }

    await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?', ['cancelled', orderId]
    );
    res.json({ success: true, message: 'Huỷ đơn hàng thành công' });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Lỗi huỷ đơn hàng' });
  } finally {
    connection.release();
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 20, 
      search,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    console.log('📋 Getting all orders with filters:', { status, page, limit, search });

    let whereClause = '';
    const params = [];
    const conditions = [];

    // Filter by status
    if (status && status !== 'all') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    // Search by order number, customer name, email, phone
    if (search) {
      conditions.push(`(
        o.order_number LIKE ? OR 
        o.delivery_name LIKE ? OR 
        o.delivery_phone LIKE ? OR
        u.email LIKE ?
      )`);
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    // Count total orders for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
    `;
    
    const [countResult] = await db.query(countQuery, params);
    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);

    // Get orders with pagination
    const offset = (page - 1) * limit;
    
    const ordersQuery = `
      SELECT 
        o.*,
        u.full_name as user_name,
        u.email as user_email,
        COUNT(oi.id) as item_count,
        SUM(oi.quantity) as total_quantity
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit), parseInt(offset));
    const [orders] = await db.query(ordersQuery, params);

    console.log(`📦 Found ${orders.length} orders`);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalOrders,
        totalPages: totalPages,
        hasMore: page < totalPages
      }
    });

  } catch (error) {
    console.error('❌ Error getting all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
};

// Get order statistics (Admin only)
export const getOrderStats = async (req, res) => {
  try {
    console.log('📊 Getting order statistics');

    // Get order count by status
    const [statusStats] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM orders 
      GROUP BY status
    `);

    // Get today's orders
    const [todayStats] = await db.query(`
      SELECT 
        COUNT(*) as today_orders,
        COALESCE(SUM(total_amount), 0) as today_revenue
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);

    // Get this month's orders
    const [monthStats] = await db.query(`
      SELECT 
        COUNT(*) as month_orders,
        COALESCE(SUM(total_amount), 0) as month_revenue
      FROM orders 
      WHERE YEAR(created_at) = YEAR(CURDATE()) 
      AND MONTH(created_at) = MONTH(CURDATE())
    `);

    // Get recent orders
    const [recentOrders] = await db.query(`
      SELECT 
        o.*,
        u.full_name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);

    const stats = {
      statusStats: statusStats,
      today: todayStats[0],
      month: monthStats[0],
      recentOrders: recentOrders
    };

    console.log('📊 Order statistics retrieved');

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error getting order statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê đơn hàng',
      error: error.message
    });
  }
};