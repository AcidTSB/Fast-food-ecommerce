import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService'; // hoặc đúng đường dẫn tới hàm createOrder
import './Checkout.css';

const Checkout = () => {
  const history = useHistory();
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    clearCart, 
    formatPrice 
  } = useCart();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
    payment: 'cash', 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [momoRedirecting, setMomoRedirecting] = useState(false);

  // Tính toán giá tiền - lấy logic từ Cart.jsx
  const subtotal = totalPrice;
  const shippingFee = subtotal >= 200000 ? 0 : 30000;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingFee + tax;

  // Kiểm tra nếu chưa đăng nhập hoặc giỏ hàng trống
  React.useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      history.push('/login', {
        message: 'Vui lòng đăng nhập để tiến hành thanh toán',
        from: 'checkout'
      });
      return;
    }

    if (!items || items.length === 0) {
      history.push('/cart');
    }
  }, [isAuthenticated, items, history]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInfoChange = e => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!form.name.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }
    if (!form.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!form.address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    if (form.payment === 'card') {
      if (
        !cardInfo.cardNumber.trim() ||
        !cardInfo.cardName.trim() ||
        !cardInfo.expiry.trim() ||
        !cardInfo.cvc.trim()
      ) {
        setError('Vui lòng nhập đầy đủ thông tin thẻ.');
        return;
      }
      // Có thể thêm validate số thẻ, CVC, expiry ở đây
    }

    // Nếu là momo thì không submit form ở đây, mà chuyển hướng ở nút riêng
    if (form.payment === 'momo') {
      setError('Vui lòng nhấn nút "Thanh toán qua MoMo/ZaloPay" để tiếp tục.');
      return;
    }

    setLoading(true);
    
    // Tạo đối tượng đơn hàng như cũ
    const newOrderData = {
      items: items.map(item => ({
        product_id: item.id, // Đúng tên trường backend cần
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variants: item.variants || []
      })),
      customer: {
        name: form.name,
        phone: form.phone,
        address: form.address
      },
      delivery_notes: form.note,
      payment_method: form.payment, // Đúng tên trường backend cần
      // Không cần tự tạo id/order_number/created_at ở client
    };

    try {
      const response = await createOrder(newOrderData); // Gọi API backend
      setOrderData(response.data); // Lưu lại dữ liệu trả về từ server
      setSuccess(true);
      setLoading(false);
      // clearCart sẽ gọi ở useEffect như cũ
    } catch (err) {
      setError(err.message || 'Đặt hàng thất bại');
      setLoading(false);
    }
  };

  // Log success state change
  useEffect(() => {
    console.log('Success state changed:', success);
  }, [success]);

  // Thêm useEffect để xử lý cleanup khi component unmount
  // Điều này giúp giỏ hàng chỉ bị xóa khi người dùng rời khỏi trang Checkout
  useEffect(() => {
    return () => {
      if (success && orderData) {
        // Chỉ xóa giỏ hàng khi rời khỏi trang và đã đặt hàng thành công
        clearCart();
        localStorage.removeItem('tempCartItems');
      }
    };
  }, [success, orderData, clearCart]);

  return (
    <div className={`checkout ${isDark ? 'dark' : ''}`}>
      {success ? (
        // Hiển thị thông báo thành công ngay trong trang
        <section className="success-section">
          <div className="container">
            <div className="success-message-card">
              <div className="success-icon">
                <span role="img" aria-label="success">✅</span>
              </div>
              <h1 className="success-title">Đặt Hàng Thành Công!</h1>
              <p className="success-subtitle">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>
              
              <div className="order-details">
                <div className="order-info-header">
                  <div>
                    <span className="label">Mã đơn hàng:</span>
                    <span className="value">#{orderData?.id || Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <div>
                    <span className="label">Ngày đặt:</span>
                    <span className="value">{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                
                <div className="success-divider"></div>
                
                <div className="customer-info">
                  <h3>Thông tin giao hàng</h3>
                  <p><strong>Người nhận:</strong> {form.name}</p>
                  <p><strong>Số điện thoại:</strong> {form.phone}</p>
                  <p><strong>Địa chỉ:</strong> {form.address}</p>
                  {form.note && <p><strong>Ghi chú:</strong> {form.note}</p>}
                </div>
                
                <div className="success-divider"></div>
                
                <div className="order-summary">
                  <h3>Sản phẩm đã đặt</h3>
                  <div className="success-items">
                    {orderData && orderData.items && orderData.items.map((item) => (
                      <div key={`${item.productId}-success`} className="success-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}đ</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="success-totals">
                    <div className="total-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}đ</span>
                    </div>
                    <div className="total-row">
                      <span>Phí giao hàng:</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="free-shipping">Miễn phí</span>
                        ) : (
                          `${formatPrice(shippingFee)}đ`
                        )}
                      </span>
                    </div>
                    <div className="total-row">
                      <span>VAT (10%):</span>
                      <span>{formatPrice(tax)}đ</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(total)}đ</span>
                    </div>
                  </div>
                </div>
                
                <div className="delivery-estimate">
                  <div className="delivery-icon">🚚</div>
                  <div>
                    <h3>Dự kiến giao hàng</h3>
                    <p>30-45 phút (từ thời điểm đặt hàng)</p>
                  </div>
                </div>
                
                <div className="success-actions">
                  <button 
                    className="action-button primary"
                    onClick={() => history.push('/')}
                  >
                    Về Trang Chủ
                  </button>
                  <button 
                    className="action-button secondary"
                    onClick={() => history.push('/orders')}
                  >
                    Xem Đơn Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Form đặt hàng ban đầu
        <>
          <section className="checkout-hero-section">
            <div className="checkout-hero-overlay"></div>
            <div className="container">
              <div className="checkout-hero-content">
                <h1 className="checkout-title">
                  <span className="title-main">Thanh Toán</span>
                  <span className="title-highlight">Nhanh &amp; An Toàn</span>
                </h1>
                <p className="checkout-subtitle">
                  Hoàn tất đơn hàng của bạn chỉ với vài bước đơn giản. Thông tin của bạn được bảo mật tuyệt đối.
                </p>
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <div className="container">
              <div className="checkout-main">
                <form className="checkout-form" onSubmit={handleSubmit}>
                  <h2 className="section-title gradient">Thông Tin Giao Hàng</h2>
                  
                  {error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {error}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ giao hàng *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                      rows={2}
                    />
                  </div>
                  <h2 className="section-title gradient">Phương Thức Thanh Toán</h2>
                  <div className="checkout-payment-methods">
                    <label className={`payment-option ${form.payment === 'cash' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash" // Đúng với enum trong DB
                        checked={form.payment === 'cash'}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">💵</span>
                      Thanh toán khi nhận hàng
                    </label>
                    <label className={`payment-option ${form.payment === 'card' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={form.payment === 'card'}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">💳</span>
                      Thẻ tín dụng/ghi nợ
                    </label>
                    <label className={`payment-option ${form.payment === 'momo' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="momo"
                        checked={form.payment === 'momo'}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">📱</span>
                      Ví điện tử MoMo/ZaloPay
                    </label>
                  </div>
                  {form.payment === 'card' && (
                    <div className="card-info-form">
                      <div className="form-group">
                        <label>Số thẻ *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={e => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                          placeholder="Nhập số thẻ"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Tên chủ thẻ *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={cardInfo.cardName}
                          onChange={e => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                          placeholder="Tên in trên thẻ"
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Hết hạn *</label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardInfo.expiry}
                            onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>CVC *</label>
                          <input
                            type="text"
                            name="cvc"
                            value={cardInfo.cvc}
                            onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                            placeholder="CVC"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {form.payment === 'momo' && (
                    <div className="momo-info">
                      <button
                        type="button"
                        className="momo-pay-btn"
                        disabled={momoRedirecting}
                        onClick={async () => {
                          setMomoRedirecting(true);
                          // Gọi API tạo link thanh toán MoMo/ZaloPay ở đây
                          // Ví dụ:
                          // const { payUrl } = await createMomoPayment(newOrderData);
                          // window.location.href = payUrl;
                          setTimeout(() => setMomoRedirecting(false), 2000); // Demo
                        }}
                      >
                        {momoRedirecting ? 'Đang chuyển hướng...' : 'Thanh toán qua MoMo/ZaloPay'}
                      </button>
                      <div className="momo-note">Bạn sẽ được chuyển sang cổng thanh toán MoMo/ZaloPay để hoàn tất giao dịch.</div>
                    </div>
                  )}
                  <button className="cta-button primary" type="submit" disabled={loading || success}>
                    {loading ? 'Đang xử lý...' : success ? 'Đặt hàng thành công!' : 'Đặt Hàng Ngay'}
                  </button>
                  {success && (
                    <div className="checkout-success">
                      🎉 Đơn hàng của bạn đã được ghi nhận! Cảm ơn bạn đã mua hàng.
                    </div>
                  )}
                </form>
                <div className="checkout-summary">
                  <h2 className="section-title gradient">Tóm Tắt Đơn Hàng</h2>
                  <div className="summary-card">
                    {/* Danh sách sản phẩm */}
                    {items && items.map((item) => (
                      <div key={`${item.id}-${JSON.stringify(item.variants || [])}`} className="summary-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}đ</span>
                      </div>
                    ))}
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}đ</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí giao hàng:</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="free-shipping">Miễn phí</span>
                        ) : (
                          `${formatPrice(shippingFee)}đ`
                        )}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>VAT (10%):</span>
                      <span>{formatPrice(tax)}đ</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span className="summary-total">{formatPrice(total)}đ</span>
                    </div>
                  </div>
                  <div className="checkout-features">
                    <div className="feature-card">
                      <span className="feature-icon">🔒</span>
                      <div className="feature-content">
                        <div className="feature-title">Bảo mật SSL</div>
                        <div className="feature-description">Thông tin của bạn được mã hóa và bảo vệ tuyệt đối.</div>
                      </div>
                    </div>
                    <div className="feature-card">
                      <span className="feature-icon">🚚</span>
                      <div className="feature-content">
                        <div className="feature-title">Giao hàng nhanh</div>
                        <div className="feature-description">Nhận món ăn chỉ sau 30-45 phút đặt hàng.</div>
                      </div>
                    </div>
                    <div className="feature-card">
                      <span className="feature-icon">💳</span>
                      <div className="feature-content">
                        <div className="feature-title">Nhiều phương thức thanh toán</div>
                        <div className="feature-description">Tiền mặt, thẻ, ví điện tử đều được hỗ trợ.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Checkout;