const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/database');

// Top khách hàng
router.get('/top-customers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await mysqlPool.query(`
      SELECT 
        u.id, 
        u.full_name, 
        COUNT(o.id) AS orderCount, 
        COALESCE(SUM(o.total_amount), 0) AS totalSpent
      FROM users u
      JOIN orders o ON o.user_id = u.id
      GROUP BY u.id
      ORDER BY totalSpent DESC
      LIMIT ?
    `, [limit]);
    res.json({ data: rows });
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Top sản phẩm bán chạy
router.get('/top-products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await mysqlPool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.image,
        COALESCE(SUM(oi.quantity), 0) AS soldCount
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY soldCount DESC
      LIMIT ?
    `, [limit]);
    res.json({ data: rows });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;