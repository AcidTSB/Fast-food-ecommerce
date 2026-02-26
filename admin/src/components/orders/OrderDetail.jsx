import React, { useState, useEffect } from 'react';
import { getOrderById } from '../../services/orderService'; // Đổi từ fetchOrderById sang getOrderById
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from './StatusBadge';
import './OrderDetail.css';

const OrderDetail = ({ order, onClose, onStatusChange }) => {
  const [orderDetails, setOrderDetails] = useState(order || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order && order.id && !orderDetails?.items) {
      fetchOrderDetails();
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    if (!order?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('📥 Fetching order details for ID:', order.id);
      
      const response = await getOrderById(order.id); // Sử dụng getOrderById thay vì fetchOrderById
      
      if (response && response.success && response.data) {
        setOrderDetails(response.data);
        console.log('✅ Order details fetched');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Error fetching order details:', err);
      setError(err.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusActions = (currentStatus) => {
    const actions = [];
    
    switch (currentStatus) {
      case 'pending':
        actions.push(
          { status: 'confirmed', label: 'Xác nhận', className: 'confirm-btn' },
          { status: 'cancelled', label: 'Hủy đơn', className: 'cancel-btn' }
        );
        break;
      case 'confirmed':
        actions.push(
          { status: 'preparing', label: 'Chuẩn bị', className: 'preparing-btn' },
          { status: 'cancelled', label: 'Hủy đơn', className: 'cancel-btn' }
        );
        break;
      case 'preparing':
        actions.push(
          { status: 'delivering', label: 'Giao hàng', className: 'delivery-btn' }
        );
        break;
      case 'delivering':
        actions.push(
          { status: 'delivered', label: 'Hoàn thành', className: 'complete-btn' }
        );
        break;
      default:
        break;
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content order-detail-modal">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal-content order-detail-modal">
          <div className="modal-header">
            <h3>Lỗi</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchOrderDetails}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="modal-overlay">
        <div className="modal-content order-detail-modal">
          <div className="modal-header">
            <h3>Lỗi</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="error-message">
            <p>Không có dữ liệu đơn hàng</p>
          </div>
        </div>
      </div>
    );
  }

  const statusActions = getStatusActions(orderDetails.status);

  return (
    <div className="modal-overlay">
      <div className="modal-content order-detail-modal">
        <div className="modal-header">
          <h3>Chi tiết đơn hàng #{orderDetails.order_number}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-info-grid">
            {/* Order Status */}
            <div className="info-section">
              <h4>Trạng thái đơn hàng</h4>
              <StatusBadge status={orderDetails.status} />
              
              {statusActions.length > 0 && (
                <div className="status-actions">
                  <h5>Cập nhật trạng thái:</h5>
                  {statusActions.map(action => (
                    <button
                      key={action.status}
                      className={`status-action-btn ${action.className}`}
                      onClick={() => onStatusChange && onStatusChange(action.status)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="info-section">
              <h4>Thông tin khách hàng</h4>
              <div className="info-item">
                <label>Tên:</label>
                <span>{orderDetails.customer_name || orderDetails.delivery_name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{orderDetails.customer_email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>SĐT:</label>
                <span>{orderDetails.delivery_phone}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{orderDetails.delivery_address}</span>
              </div>
              {orderDetails.delivery_notes && (
                <div className="info-item">
                  <label>Ghi chú:</label>
                  <span>{orderDetails.delivery_notes}</span>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="info-section">
              <h4>Thông tin đơn hàng</h4>
              <div className="info-item">
                <label>Mã đơn:</label>
                <span>{orderDetails.order_number}</span>
              </div>
              <div className="info-item">
                <label>Ngày đặt:</label>
                <span>{formatDate(orderDetails.created_at)}</span>
              </div>
              <div className="info-item">
                <label>Phương thức thanh toán:</label>
                <span>{orderDetails.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái thanh toán:</label>
                <span className={`payment-status ${orderDetails.payment_status}`}>
                  {orderDetails.payment_status === 'pending' ? 'Chưa thanh toán' : 
                   orderDetails.payment_status === 'paid' ? 'Đã thanh toán' : 'Thất bại'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h4>Sản phẩm trong đơn hàng</h4>
            {orderDetails.items && orderDetails.items.length > 0 ? (
              <div className="order-items-list">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h5>{item.product_name}</h5>
                      <div className="item-meta">
                        <span>Giá: {formatPrice(item.price)} VNĐ</span>
                        <span>Số lượng: {item.quantity}</span>
                        <span className="item-total">
                          Thành tiền: {formatPrice(item.total || (item.price * item.quantity))} VNĐ
                        </span>
                      </div>
                      {item.notes && (
                        <div className="item-notes">
                          <em>Ghi chú: {item.notes}</em>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items">Không có sản phẩm nào trong đơn hàng</div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h4>Tổng kết đơn hàng</h4>
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatPrice(orderDetails.subtotal)} VNĐ</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng:</span>
              <span>{formatPrice(orderDetails.delivery_fee || 0)} VNĐ</span>
            </div>
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{formatPrice(orderDetails.total_amount)} VNĐ</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;