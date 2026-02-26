const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Thay bằng password MySQL của bạn
  database: 'fastfood_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection pool created');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

module.exports = pool;