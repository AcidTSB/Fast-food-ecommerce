import React, { useState, useEffect, useCallback } from 'react';
import { getUserOrders, cancelOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Add dark mode detection - FIX: Better detection
  const [isDarkMode, setIsDarkMode] = useState(false);

  // New states for cancellation confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);

  // Enhanced dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      // Check multiple sources for dark mode
      const savedTheme = localStorage.getItem('theme');
      const bodyHasDarkClass = document.body.classList.contains('dark');
      const htmlHasDarkClass = document.documentElement.classList.contains('dark');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Priority: body class > localStorage > system preference
      const isDark = bodyHasDarkClass || htmlHasDarkClass || savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
      
      console.log('Dark mode check:', {
        savedTheme,
        bodyHasDarkClass,
        htmlHasDarkClass,
        systemPrefersDark,
        result: isDark
      });
      
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        checkDarkMode();
      }
    };

    // Listen for body class changes (using MutationObserver)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    // Observe body and html class changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => checkDarkMode();
    
    // For older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom theme change events
    const handleThemeChange = () => {
      setTimeout(checkDarkMode, 100); // Small delay to ensure classes are updated
    };
    
    window.addEventListener('themechange', handleThemeChange);
    document.addEventListener('themechange', handleThemeChange);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
      document.removeEventListener('themechange', handleThemeChange);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Force re-check dark mode every 1 second (fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      const bodyHasDarkClass = document.body.classList.contains('dark');
      const htmlHasDarkClass = document.documentElement.classList.contains('dark');
      const savedTheme = localStorage.getItem('theme');
      
      const shouldBeDark = bodyHasDarkClass || htmlHasDarkClass || savedTheme === 'dark';
      
      if (shouldBeDark !== isDarkMode) {
        console.log('Force updating dark mode:', shouldBeDark);
        setIsDarkMode(shouldBeDark);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDarkMode]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API hoặc lấy từ localStorage
      const response = await getUserOrders();
      
      console.log('Orders response:', response);
      
      if (response.success) {
        const ordersData = response.data || [];
        setAllOrders(ordersData);
        filterOrders(ordersData, filter);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch user orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Filter orders by status
  const filterOrders = (ordersData, currentFilter) => {
    if (currentFilter === 'all') {
      // Chỉ hiển thị đơn hàng không ở trạng thái "cancelled" trong tab "Tất cả"
      const nonCancelledOrders = ordersData.filter(order => order.status !== 'cancelled');
      setOrders(nonCancelledOrders);
    } else {
      const filtered = ordersData.filter(order => order.status === currentFilter);
      setOrders(filtered);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    filterOrders(allOrders, newFilter);
  };

  // Get count for each status
  const getStatusCount = (status) => {
    if (status === 'all') {
      // Không tính đơn hàng đã hủy vào tổng số
      return allOrders.filter(order => order.status !== 'cancelled').length;
    }
    return allOrders.filter(order => order.status === status).length;
  };

  // Sửa lại hàm bắt đầu quá trình hủy đơn
  const initiateOrderCancel = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirmModal(true);
  };

  // Hàm xử lý xác nhận hủy đơn
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    try {
      await cancelOrder(orderToCancel);
      
      // Update orders list
      const updatedOrders = allOrders.map(order => 
        order.id === orderToCancel 
          ? { ...order, status: 'cancelled', cancelled_at: new Date() }
          : order
      );
      
      setAllOrders(updatedOrders);
      filterOrders(updatedOrders, filter);
      
      // Đóng modal xác nhận và hiển thị thông báo thành công
      setShowConfirmModal(false);
      setCancellationSuccess(true);
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setCancellationSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error cancelling order:', error);
      
      // Hiển thị lỗi trong modal
      setShowConfirmModal(false);
      // Có thể thêm state riêng để hiển thị lỗi
      alert('Không thể hủy đơn hàng. Vui lòng thử lại!');
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Safe number formatter
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0 ₫';
    }
    const numPrice = Number(price);
    return numPrice.toLocaleString('vi-VN') + ' ₫';
  };

  // Safe date formatter
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'pending': 'status-pending',
      'processing': 'status-processing', 
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return classMap[status] || 'status-pending';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'pending': '⏳',
      'processing': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return iconMap[status] || '📦';
  };

  console.log('Orders component - isDarkMode:', isDarkMode); // Debug log

  if (!isAuthenticated) {
    return (
      <div className={`orders-page ${isDarkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="not-authenticated">
            <h2>Bạn chưa đăng nhập</h2>
            <p>Vui lòng đăng nhập để xem đơn hàng của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`orders-page ${isDarkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`orders-page ${isDarkMode ? 'dark' : ''}`}>
        <div className="container">
          <div className="error-message">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`orders-page ${isDarkMode ? 'dark' : ''}`}>      
      <div className="container">
        <div className="page-header">
          <h1>Đơn hàng của tôi</h1>
          <p>Theo dõi và quản lý đơn hàng của bạn</p>
        </div>

        {/* Filter Tabs */}
        <div className="orders-tabs">
          <button 
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            📋 Tất cả ({getStatusCount('all')})
          </button>
          <button 
            className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            ⏳ Chờ xác nhận ({getStatusCount('pending')})
          </button>
          <button 
            className={`tab-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('processing')}
          >
            🚚 Đang giao ({getStatusCount('processing')})
          </button>
          <button 
            className={`tab-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => handleFilterChange('delivered')}
          >
            ✅ Đã giao ({getStatusCount('delivered')})
          </button>
          <button 
            className={`tab-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => handleFilterChange('cancelled')}
          >
            ❌ Đã hủy ({getStatusCount('cancelled')})
          </button>
        </div>

        {/* Orders Content */}
        <div className="orders-content">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📪</div>
              <h3>Không có đơn hàng nào</h3>
              <p>
                {filter === 'all' 
                  ? 'Bạn chưa có đơn hàng nào'
                  : `Bạn chưa có đơn hàng nào ở trạng thái "${getStatusText(filter)}"`
                }
              </p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-info">
                      <h3>#{order.order_number || `ORDER-${order.id}`}</h3>
                      <p className="order-date">
                        Đặt ngày: {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)} {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="order-items">
                    {(Array.isArray(order.items) && order.items.length > 0) ? (
                      <>
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={item.id || index} className="order-item">
                            <span className="item-name">
                              {item.product_name || 'Unknown Product'}
                            </span>
                            <span className="item-quantity">
                              x{item.quantity || 0}
                            </span>
                            <span className="item-price">
                              {formatPrice(item.total)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="more-items">
                            và {order.items.length - 2} sản phẩm khác...
                          </p>
                        )}
                      </>
                    ) : (
                      <p>Không có sản phẩm</p>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Tổng: {formatPrice(order.total_amount)}</strong>
                    </div>
                    <div className="order-actions">
                      <button 
                        className="view-detail-btn"
                        onClick={() => viewOrderDetails(order)}
                      >
                        Xem chi tiết
                      </button>
                      
                      {order.status === 'delivered' && (
                        <button className="reorder-btn">
                          Đặt lại
                        </button>
                      )}
                      
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button 
                          className="cancel-btn"
                          onClick={() => initiateOrderCancel(order.id)}
                        >
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {showModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Chi tiết đơn hàng #{selectedOrder.order_number}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                {/* Order Info */}
                <div className="detail-section">
                  <h3>Thông tin đơn hàng</h3>
                  <p><strong>Mã đơn hàng:</strong> {selectedOrder.order_number}</p>
                  <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusText(selectedOrder.status)}</p>
                  <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</p>
                </div>

                {/* Shipping Info */}
                <div className="detail-section">
                  <h3>Thông tin giao hàng</h3>
                  <p><strong>Địa chỉ:</strong> {selectedOrder.delivery_address}</p>
                  <p><strong>Số điện thoại:</strong> {selectedOrder.delivery_phone}</p>
                  {selectedOrder.delivery_notes && (
                    <p><strong>Ghi chú:</strong> {selectedOrder.delivery_notes}</p>
                  )}
                </div>

                {/* Order Items */}
                <div className="detail-section">
                  <h3>Sản phẩm đã đặt</h3>
                  <div className="detail-items">
                    {selectedOrder.items.map((item, index) => (
                      <div key={item.id || index} className="detail-item">
                        <span className="detail-item-name">
                          {item.product_name}
                        </span>
                        <span className="detail-item-qty">
                          x{item.quantity}
                        </span>
                        <span className="detail-item-price">
                          {formatPrice(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="detail-total">
                    <p>Tổng tiền hàng: {formatPrice(selectedOrder.subtotal || selectedOrder.total_amount)}</p>
                    <p>Phí vận chuyển: {formatPrice(selectedOrder.delivery_fee)}</p>
                    {Number(selectedOrder.discount_amount) > 0 && (
                      <p>Giảm giá: -{formatPrice(selectedOrder.discount_amount)}</p>
                    )}
                    <p>
                      <strong>
                        Tổng thanh toán: {
                          formatPrice(
                            Number(selectedOrder.total_amount) +
                            Number(selectedOrder.delivery_fee || 0) -
                            Number(selectedOrder.discount_amount || 0)
                          )
                        }
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận hủy đơn hàng */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content confirm-modal">
              <div className="modal-header warning-header">
                <h2>Xác nhận hủy đơn</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowConfirmModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="warning-icon">⚠️</div>
                <h3>Bạn chắc chắn muốn hủy đơn hàng này?</h3>
                <p>Đơn hàng sau khi hủy sẽ không thể khôi phục.</p>
                
                <div className="confirm-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Giữ đơn hàng
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={handleCancelOrder}
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thông báo hủy đơn thành công */}
        {cancellationSuccess && (
          <div className="toast-notification success">
            <div className="toast-icon">✅</div>
            <div className="toast-content">
              <h4>Đơn hàng đã được hủy thành công!</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;