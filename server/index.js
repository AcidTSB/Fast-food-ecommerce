const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const db = require('./config/mysql-connection');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Kết nối database
db.getConnection()
  .then(conn => {
    console.log('✅ Kết nối MySQL thành công');
    conn.release(); // Trả connection về pool
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});