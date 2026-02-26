const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'fastfood_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

console.log('🔧 MySQL Database config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ MySQL connection pool created');
} catch (error) {
  console.error('❌ Failed to create MySQL pool:', error);
  process.exit(1);
}

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fastfood', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add these options for more reliable connections:
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit process here, just log the error
  }
};

module.exports = { mysqlPool: pool, connectDB };