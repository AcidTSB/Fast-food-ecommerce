import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const statsData = await api.getDashboardStats();
        setStats(statsData);
        setSalesData(statsData.salesByMonth || []);

        const ordersData = await api.getRecentOrders(5);
        setRecentOrders(ordersData);

        const productsData = await api.getTopProducts(4);
        setTopProducts(productsData);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon money">💰</div>
          <div className="stat-content">
            <h3>Tổng Doanh Thu</h3>
            {loading ? (
              <div className="loading-placeholder">Đang tải...</div>
            ) : (
              <>
                <div className="stat-value">{stats.totalSales?.toLocaleString('vi-VN')}đ</div>
                <div className={`stat-change ${stats.salesGrowth > 0 ? 'positive' : stats.salesGrowth < 0 ? 'negative' : 'neutral'}`}>
                  {stats.salesGrowth > 0 ? '+' : ''}{stats.salesGrowth}% so với tháng trước
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders">🛒</div>
          <div className="stat-content">
            <h3>Tổng Đơn Hàng</h3>
            {loading ? (
              <div className="loading-placeholder">Đang tải...</div>
            ) : (
              <>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className={`stat-change ${stats.ordersGrowth > 0 ? 'positive' : stats.ordersGrowth < 0 ? 'negative' : 'neutral'}`}>
                  {stats.ordersGrowth > 0 ? '+' : ''}{stats.ordersGrowth}% so với tháng trước
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customers">👥</div>
          <div className="stat-content">
            <h3>Khách Hàng</h3>
            {loading ? (
              <div className="loading-placeholder">Đang tải...</div>
            ) : (
              <>
                <div className="stat-value">{stats.totalCustomers}</div>
                <div className={`stat-change ${stats.customersGrowth > 0 ? 'positive' : stats.customersGrowth < 0 ? 'negative' : 'neutral'}`}>
                  {stats.customersGrowth > 0 ? '+' : ''}{stats.customersGrowth}% so với tháng trước
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon products">📦</div>
          <div className="stat-content">
            <h3>Sản Phẩm</h3>
            {loading ? (
              <div className="loading-placeholder">Đang tải...</div>
            ) : (
              <>
                <div className="stat-value">{stats.totalProducts}</div>
                <div className={`stat-change ${stats.productsGrowth > 0 ? 'positive' : stats.productsGrowth < 0 ? 'negative' : 'neutral'}`}>
                  {stats.productsGrowth > 0 ? '+' : ''}{stats.productsGrowth || 0}% so với tháng trước
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="card-header">
            <h2>Tổng Quan Doanh Thu</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-placeholder">Đang tải dữ liệu doanh thu...</div>
            ) : salesData.length > 0 ? (
              <div className="sales-chart">
                {salesData.map((item, index) => (
                  <div key={index} className="chart-column">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        height: `${(item.sales / Math.max(...salesData.map(d => d.sales))) * 100}%` 
                      }}
                    >
                      <span className="chart-value">{item.sales.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="chart-label">{item.month}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Không có dữ liệu doanh thu</div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-details">
        <div className="card recent-orders">
          <div className="card-header">
            <h2>Đơn Hàng Gần Đây</h2>
            <a href="/orders" className="view-all">Xem Tất Cả</a>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-placeholder">Đang tải đơn hàng...</div>
            ) : recentOrders.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Số Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.total.toLocaleString('vi-VN')}đ</td>
                      <td>
                        <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">Chưa có đơn hàng nào</div>
            )}
          </div>
        </div>
        
        <div className="card top-products">
          <div className="card-header">
            <h2>Sản Phẩm Bán Chạy</h2>
            <a href="/products" className="view-all">Xem Tất Cả</a>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-placeholder">Đang tải sản phẩm...</div>
            ) : topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} className="product-image" />
                  <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">
                      <span className="product-price">{product.price.toLocaleString('vi-VN')}đ</span>
                      <span className="product-sales">Đã bán {product.soldCount}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">Chưa có sản phẩm nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;