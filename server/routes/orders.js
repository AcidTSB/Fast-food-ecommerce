const express = require('express');
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  createOrder,
  getUserOrders,
  cancelOrder
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.get('/',  getAllOrders);
router.get('/stats', auth, getOrderStats);

// User routes
router.post('/', auth, createOrder); 
router.get('/my-orders', auth, getUserOrders);
router.post('/:id/cancel', auth, cancelOrder); //
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus);
router.get('/recent', async (req, res) => {
  try {
    const { mysqlPool } = require('../config/database');
    const limit = parseInt(req.query.limit) || 5;
    const [recentOrders] = await mysqlPool.query(`
      SELECT o.id, o.order_number, o.total_amount AS total, o.status, o.created_at, u.full_name AS customerName
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [limit]);

    res.json({
      success: true,
      data: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customerName || 'Khách hàng',
        total: order.total,
        status: order.status,
        createdAt: order.created_at
      }))
    });
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;