import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Thêm useAuth
import CartItem from '../components/cart/CartItem';
import './Cart.css';

const Cart = () => {
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth(); // Thêm auth check
  const { items = [], totalItems = 0, totalPrice = 0, clearCart } = useCart() || {};
  const history = useHistory();

  // Format giá tiền với xử lý an toàn
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
    
    if (isNaN(numPrice)) {
      return '0';
    }
    
    return numPrice.toLocaleString('vi-VN');
  };

  // Xử lý checkout với authentication check
  const handleCheckout = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      
      // Lưu redirect path để sau khi login quay về cart
      localStorage.setItem('redirectAfterLogin', '/cart');
      
      // Chuyển hướng đến trang login với thông báo
      history.push('/login', { 
        message: 'Vui lòng đăng nhập để tiến hành thanh toán',
        from: 'cart'
      });
      return;
    }
    
    // Nếu đã đăng nhập, tiếp tục checkout
    history.push('/checkout');
  };

  // Guard clause cho trường hợp items undefined
  if (!items || items.length === 0) {
    return (
      <div className={`cart-page ${isDark ? 'dark' : ''}`}>
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ Hàng Trống</h2>
            <p>Có vẻ như bạn chưa thêm món nào vào giỏ hàng.</p>
            <Link to="/products" className="btn btn-primary">
              <span className="btn-icon">🍔</span>
              Xem Thực Đơn
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      clearCart();
    }
  };

  const subtotal = totalPrice;
  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  return (
    <div className={`cart-page ${isDark ? 'dark' : ''}`}>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Giỏ Hàng Của Bạn</h1>
          <div className="page-breadcrumb">
            <Link to="/">Trang Chủ</Link>
            <span className="breadcrumb-separator">›</span>
            <span>Giỏ Hàng</span>
          </div>
        </div>
        
        <div className="cart-content">
          <div className="cart-items-container">
            <div className="cart-header">
              <div className="cart-header-item">Sản Phẩm</div>
              <div className="cart-header-price">Đơn Giá</div>
              <div className="cart-header-quantity">Số Lượng</div>
              <div className="cart-header-subtotal">Thành Tiền</div>
              <div className="cart-header-remove">Xóa</div>
            </div>
            
            <div className="cart-items">
              {items.map(item => (
                <CartItem key={`${item.id}-${JSON.stringify(item.variants || [])}`} item={item} />
              ))}
            </div>
            
            <div className="cart-actions">
              <button 
                type="button" 
                className="clear-cart-btn"
                onClick={handleClearCart}
              >
                <span className="btn-icon">🗑️</span>
                Xóa Tất Cả
              </button>
              
              <Link to="/products" className="continue-shopping-btn">
                <span className="btn-icon">🛍️</span>
                Tiếp Tục Mua Sắm
              </Link>
            </div>
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Tóm Tắt Đơn Hàng</h2>
            
            <div className="summary-content">
              <div className="summary-row">
                <span>Tổng số món:</span>
                <span className="summary-value">{totalItems} món</span>
              </div>
              
              <div className="summary-row subtotal">
                <span>Tạm tính:</span>
                <span className="summary-value">{formatPrice(subtotal)}đ</span>
              </div>
              
              <div className="summary-row shipping">
                <span>Phí giao hàng:</span>
                <span className="summary-value">
                  {shippingFee === 0 ? (
                    <span className="free-shipping">Miễn phí</span>
                  ) : (
                    `${formatPrice(shippingFee)}đ`
                  )}
                </span>
              </div>
              
              <div className="summary-row tax">
                <span>VAT (10%):</span>
                <span className="summary-value">{formatPrice(tax)}đ</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="summary-value total-amount">{formatPrice(total)}đ</span>
              </div>
            </div>
            
            {/* Authentication Notice */}
            {!isAuthenticated && (
              <div className="auth-notice">
                <div className="notice-icon">🔐</div>
                <p className="notice-text">
                  Vui lòng <Link to="/login" className="notice-link">đăng nhập</Link> để tiến hành thanh toán
                </p>
              </div>
            )}
            
            <div className="checkout-section">
              <button 
                type="button"
                className={`checkout-btn ${!isAuthenticated ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={!isAuthenticated}
              >
                <span className="btn-icon">
                  {isAuthenticated ? '💳' : '🔒'}
                </span>
                {isAuthenticated ? 'Tiến Hành Thanh Toán' : 'Đăng Nhập Để Thanh Toán'}
              </button>
              
              <div className="shipping-note">
                <div className="note-item">
                  <span className="note-icon">🚚</span>
                  <span>Miễn phí giao hàng cho đơn từ 200.000đ</span>
                </div>
                <div className="note-item">
                  <span className="note-icon">⏱️</span>
                  <span>Giao hàng trong 30-45 phút</span>
                </div>
              </div>
            </div>
            
            <div className="payment-methods">
              <p className="payment-title">Phương Thức Thanh Toán:</p>
              <div className="payment-icons">
                <div className="payment-item">
                  <span className="payment-icon">💳</span>
                  <span className="payment-text">Thẻ tín dụng</span>
                </div>
                <div className="payment-item">
                  <span className="payment-icon">💰</span>
                  <span className="payment-text">Tiền mặt</span>
                </div>
                <div className="payment-item">
                  <span className="payment-icon">📱</span>
                  <span className="payment-text">Ví điện tử</span>
                </div>
              </div>
            </div>
            
            <div className="security-badge">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span className="security-text">Thanh toán an toàn 100%</span>
              </div>
              <div className="security-item">
                <span className="security-icon">✅</span>
                <span className="security-text">Bảo mật thông tin khách hàng</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gợi ý sản phẩm */}
        <div className="cart-suggestions">
          <h3 className="suggestions-title">Có thể bạn sẽ thích</h3>
          <div className="suggestions-grid">
            <div className="suggestion-item">
              <div className="suggestion-image">
                <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop" alt="Gà rán giòn" />
              </div>
              <div className="suggestion-info">
                <h4>Gà Rán Giòn</h4>
                <p className="suggestion-price">45.000đ</p>
                <button className="add-suggestion-btn">
                  <span>+</span> Thêm vào giỏ
                </button>
              </div>
            </div>
            
            <div className="suggestion-item">
              <div className="suggestion-image">
                <img src="https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=200&h=200&fit=crop" alt="Khoai tây chiên" />
              </div>
              <div className="suggestion-info">
                <h4>Khoai Tây Chiên</h4>
                <p className="suggestion-price">25.000đ</p>
                <button className="add-suggestion-btn">
                  <span>+</span> Thêm vào giỏ
                </button>
              </div>
            </div>
            
            <div className="suggestion-item">
              <div className="suggestion-image">
                <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" alt="Nước ngọt" />
              </div>
              <div className="suggestion-info">
                <h4>Coca Cola</h4>
                <p className="suggestion-price">15.000đ</p>
                <button className="add-suggestion-btn">
                  <span>+</span> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;