const { mysqlPool } = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ totalSales }]] = await mysqlPool.query('SELECT IFNULL(SUM(total_amount), 0) AS totalSales FROM orders WHERE status="delivered"');
    const [[{ totalOrders }]] = await mysqlPool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalCustomers }]] = await mysqlPool.query('SELECT COUNT(*) AS totalCustomers FROM users WHERE role="customer"');
    const [[{ totalProducts }]] = await mysqlPool.query('SELECT COUNT(*) AS totalProducts FROM products');

    res.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      productsGrowth: 0,
      salesByMonth: []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};