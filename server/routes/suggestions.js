const express = require('express');
const db = require('../config/mysql-connection.js');

const router = express.Router();

// GET /api/products/:id/suggestions
router.get('/products/:id/suggestions', async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    // Lấy các sản phẩm thường mua cùng sản phẩm hiện tại
    const [rows] = await db.query(
      `SELECT oi2.product_id, p.name, p.image, p.price, COUNT(*) AS frequency
       FROM order_items oi1
       JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi2.product_id != oi1.product_id
       JOIN products p ON p.id = oi2.product_id
       WHERE oi1.product_id = ?
       GROUP BY oi2.product_id
       ORDER BY frequency DESC
       LIMIT 4`,
      [productId]
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('❌ Error fetching product suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy gợi ý sản phẩm'
    });
  }
});

module.exports = router;
