import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fastfood_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
const testConnection = async () => {
  try {
    console.log('🔧 Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // Exit if cannot connect to database
  }
};

// Run test on startup
testConnection();

export default pool;