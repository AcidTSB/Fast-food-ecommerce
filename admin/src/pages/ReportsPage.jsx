import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import './ReportsPage.css';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy doanh thu theo tháng
        const stats = await api.getDashboardStats();
        setSalesByMonth(stats.salesByMonth || []);

        // Lấy top khách hàng
        const customersRes = await api.getTopCustomers(5);
        setTopCustomers(customersRes.data || []);

        // Lấy top sản phẩm
        const productsRes = await api.getTopSellingProducts(5);
        setTopProducts(productsRes.data || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu báo cáo:', error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  return (
    <Layout>
      <div className="reports-page">
        <h1>Báo Cáo Tổng Hợp</h1>

        <div className="reports-row">
          {/* Doanh thu theo tháng */}
          <section className="report-section">
            <h2>Doanh Thu Theo Tháng</h2>
            {loading ? (
              <div>Đang tải dữ liệu...</div>
            ) : salesByMonth.length > 0 ? (
              <div className="sales-chart" style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180 }}>
                {salesByMonth.map((item, idx) => (
                  <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        background: '#4f8cff',
                        height: `${(item.sales / Math.max(...salesByMonth.map(d => d.sales))) * 120 + 10}px`,
                        borderRadius: 4,
                        marginBottom: 4,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      {item.sales.toLocaleString('vi-VN')}đ
                    </div>
                    <div style={{ fontSize: 13, color: '#555' }}>{item.month}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Không có dữ liệu doanh thu</div>
            )}
          </section>
        </div>

        <div className="reports-row">
          {/* Top khách hàng */}
          <section className="report-section">
            <h2>Top Khách Hàng</h2>
            {loading ? (
              <div>Đang tải dữ liệu...</div>
            ) : topCustomers.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khách Hàng</th>
                    <th>Số Đơn</th>
                    <th>Tổng Chi Tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((cus, idx) => (
                    <tr key={cus.id || idx}>
                      <td>{cus.full_name || cus.name || 'Khách hàng'}</td>
                      <td>{cus.orderCount}</td>
                      <td>{cus.totalSpent?.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Không có dữ liệu khách hàng</div>
            )}
          </section>

          {/* Top sản phẩm */}
          <section className="report-section">
            <h2>Top Sản Phẩm Bán Chạy</h2>
            {loading ? (
              <div>Đang tải dữ liệu...</div>
            ) : topProducts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Đã Bán</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((prod, idx) => (
                    <tr key={prod.id || idx}>
                      <td>{prod.name}</td>
                      <td>{prod.price?.toLocaleString('vi-VN')}đ</td>
                      <td>{prod.soldCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Không có dữ liệu sản phẩm</div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;