const express = require('express');
const router = express.Router();
const { mysqlPool } = require('../config/database');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    // Tổng số đơn hàng
    const [[{ totalOrders }]] = await mysqlPool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    // Tổng số khách hàng
    const [[{ totalCustomers }]] = await mysqlPool.query('SELECT COUNT(*) AS totalCustomers FROM users WHERE role = "customer"');
    // Tổng số sản phẩm
    const [[{ totalProducts }]] = await mysqlPool.query('SELECT COUNT(*) AS totalProducts FROM products');
    // Tổng doanh thu (chỉ tính đơn đã giao)
    const [[{ totalSales }]] = await mysqlPool.query("SELECT COALESCE(SUM(total_amount),0) AS totalSales FROM orders WHERE status = 'delivered'");

    // Doanh thu theo tháng (6 tháng gần nhất)
    const [salesByMonth] = await mysqlPool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%m/%Y') AS month,
        COALESCE(SUM(total_amount),0) AS sales
      FROM orders
      WHERE status = 'delivered' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%m/%Y')
      ORDER BY MIN(created_at)
    `);

    // Truy vấn số liệu để tính tăng trưởng
    const [[growthData]] = await mysqlPool.query(`
      SELECT
        -- Doanh thu
        SUM(CASE WHEN o.status = 'delivered' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN o.total_amount ELSE 0 END) AS currentSales,
        SUM(CASE WHEN o.status = 'delivered' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND o.created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN o.total_amount ELSE 0 END) AS previousSales,
        
        -- Đơn hàng
        COUNT(CASE WHEN o.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) AS currentOrders,
        COUNT(CASE WHEN o.created_at >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND o.created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) AS previousOrders,
        
        -- Khách hàng
        (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AS currentCustomers,
        (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AS previousCustomers,
        
        -- Sản phẩm
        (SELECT COUNT(*) FROM products WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AS currentProducts,
        (SELECT COUNT(*) FROM products WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) AS previousProducts
      FROM orders o;
    `);

    function calcGrowth(current, previous) {
      if (!previous || previous === 0) return current > 0 ? 100 : 0;
      return +(((current - previous) / previous) * 100).toFixed(2);
    }

    const salesGrowth = calcGrowth(growthData.currentSales, growthData.previousSales);
    const ordersGrowth = calcGrowth(growthData.currentOrders, growthData.previousOrders);
    const customersGrowth = calcGrowth(growthData.currentCustomers, growthData.previousCustomers);
    const productsGrowth = calcGrowth(growthData.currentProducts, growthData.previousProducts);

    // Trả kết quả
    res.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesGrowth,
      ordersGrowth,
      customersGrowth,
      productsGrowth,
      salesByMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/dashboard/recent-orders
router.get('/recent-orders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [recentOrders] = await mysqlPool.query(`
      SELECT o.id, o.order_number, o.total_amount AS total, o.status, o.created_at, u.full_name AS customerName
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [limit]);

    res.json(recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customerName || 'Khách hàng',
      total: order.total,
      status: order.status,
      createdAt: order.created_at
    })));
  } catch (error) {
    console.error('Recent orders error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/dashboard/top-products
router.get('/top-products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const [topProducts] = await mysqlPool.query(`
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

    res.json(topProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      soldCount: product.soldCount,
      image: product.image
    })));
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;