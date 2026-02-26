import React, { useState } from 'react';
import './CheckoutForm.css';

const CheckoutForm = ({ onSubmit, totalAmount }) => {
  const [formData, setFormData] = useState({
    // Customer Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Information
    deliveryOption: 'delivery', // delivery, pickup
    address: {
      street: '',
      city: '',
      ward: '',
      district: '',
      zipCode: '',
      country: 'Vietnam'
    },
    
    // Payment Information
    paymentMethod: 'cash', // cash, credit_card, momo, zalopay
    paymentDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    },
    
    // Order Notes
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.startsWith('payment.')) {
      const paymentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        paymentDetails: {
          ...prev.paymentDetails,
          [paymentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'Họ là bắt buộc';
    if (!formData.lastName.trim()) newErrors.lastName = 'Tên là bắt buộc';
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ';
    }

    // Address validation for delivery
    if (formData.deliveryOption === 'delivery') {
      if (!formData.address.street.trim()) newErrors['address.street'] = 'Địa chỉ là bắt buộc';
      if (!formData.address.city.trim()) newErrors['address.city'] = 'Thành phố là bắt buộc';
      if (!formData.address.district.trim()) newErrors['address.district'] = 'Quận/Huyện là bắt buộc';
      if (!formData.address.ward.trim()) newErrors['address.ward'] = 'Phường/Xã là bắt buộc';
    }

    // Payment validation for credit card
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.paymentDetails.cardNumber.trim()) {
        newErrors['payment.cardNumber'] = 'Số thẻ là bắt buộc';
      } else if (formData.paymentDetails.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors['payment.cardNumber'] = 'Vui lòng nhập số thẻ hợp lệ';
      }

      if (!formData.paymentDetails.expiryDate.trim()) {
        newErrors['payment.expiryDate'] = 'Ngày hết hạn là bắt buộc';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.paymentDetails.expiryDate)) {
        newErrors['payment.expiryDate'] = 'Vui lòng nhập theo định dạng MM/YY';
      }

      if (!formData.paymentDetails.cvv.trim()) {
        newErrors['payment.cvv'] = 'CVV là bắt buộc';
      } else if (!/^\d{3,4}$/.test(formData.paymentDetails.cvv)) {
        newErrors['payment.cvv'] = 'Vui lòng nhập CVV hợp lệ';
      }

      if (!formData.paymentDetails.cardholderName.trim()) {
        newErrors['payment.cardholderName'] = 'Tên chủ thẻ là bắt buộc';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setProcessing(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message || 'Không thể xử lý đơn hàng' });
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const deliveryFee = formData.deliveryOption === 'delivery' ? 30000 : 0;
  const finalTotal = totalAmount + deliveryFee;

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {/* Delivery Options */}
      <div className="form-section">
        <h3>🚚 Tùy chọn giao hàng</h3>
        <div className="delivery-options">
          <label className="radio-option">
            <input
              type="radio"
              name="deliveryOption"
              value="delivery"
              checked={formData.deliveryOption === 'delivery'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>Giao hàng tận nơi</strong>
              <span className="option-price">+ 30.000đ</span>
              <small>Giao hàng đến địa chỉ của bạn</small>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="deliveryOption"
              value="pickup"
              checked={formData.deliveryOption === 'pickup'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>Đến lấy tại cửa hàng</strong>
              <span className="option-price">Miễn phí</span>
              <small>Đến nhận tại cửa hàng của chúng tôi</small>
            </div>
          </label>
        </div>
      </div>

      {/* Customer Information */}
      <div className="form-section">
        <h3>👤 Thông tin khách hàng</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Họ *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'error' : ''}
              placeholder="Nguyễn"
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label>Tên *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'error' : ''}
              placeholder="Văn A"
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="nguyen.vana@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="0123 456 789"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {formData.deliveryOption === 'delivery' && (
        <div className="form-section">
          <h3>📍 Địa chỉ giao hàng</h3>
          <div className="form-group">
            <label>Địa chỉ cụ thể *</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              className={errors['address.street'] ? 'error' : ''}
              placeholder="123 Đường ABC, Chung cư XYZ"
            />
            {errors['address.street'] && <span className="error-text">{errors['address.street']}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phường/Xã *</label>
              <input
                type="text"
                name="address.ward"
                value={formData.address.ward}
                onChange={handleInputChange}
                className={errors['address.ward'] ? 'error' : ''}
                placeholder="Phường Bến Nghé"
              />
              {errors['address.ward'] && <span className="error-text">{errors['address.ward']}</span>}
            </div>
            
            <div className="form-group">
              <label>Quận/Huyện *</label>
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleInputChange}
                className={errors['address.district'] ? 'error' : ''}
                placeholder="Quận 1"
              />
              {errors['address.district'] && <span className="error-text">{errors['address.district']}</span>}
            </div>
            
            <div className="form-group">
              <label>Thành phố *</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className={errors['address.city'] ? 'error' : ''}
                placeholder="TP. Hồ Chí Minh"
              />
              {errors['address.city'] && <span className="error-text">{errors['address.city']}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="form-section">
        <h3>💳 Phương thức thanh toán</h3>
        <div className="payment-methods">
          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === 'cash'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>💵 Thanh toán khi nhận hàng</strong>
              <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.paymentMethod === 'credit_card'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>💳 Thẻ tín dụng/ghi nợ</strong>
              <small>Visa, Mastercard, American Express</small>
            </div>
          </label>
          
          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={formData.paymentMethod === 'momo'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>🟣 Ví MoMo</strong>
              <small>Thanh toán qua ví điện tử MoMo</small>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="zalopay"
              checked={formData.paymentMethod === 'zalopay'}
              onChange={handleInputChange}
            />
            <span className="radio-custom"></span>
            <div className="option-info">
              <strong>🔵 ZaloPay</strong>
              <small>Thanh toán qua ví điện tử ZaloPay</small>
            </div>
          </label>
        </div>

        {/* Credit Card Details */}
        {formData.paymentMethod === 'credit_card' && (
          <div className="card-details">
            <div className="form-group">
              <label>Tên chủ thẻ *</label>
              <input
                type="text"
                name="payment.cardholderName"
                value={formData.paymentDetails.cardholderName}
                onChange={handleInputChange}
                className={errors['payment.cardholderName'] ? 'error' : ''}
                placeholder="NGUYEN VAN A"
              />
              {errors['payment.cardholderName'] && <span className="error-text">{errors['payment.cardholderName']}</span>}
            </div>

            <div className="form-group">
              <label>Số thẻ *</label>
              <input
                type="text"
                name="payment.cardNumber"
                value={formatCardNumber(formData.paymentDetails.cardNumber)}
                onChange={(e) => handleInputChange({
                  target: {
                    name: 'payment.cardNumber',
                    value: e.target.value.replace(/\s/g, '')
                  }
                })}
                className={errors['payment.cardNumber'] ? 'error' : ''}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors['payment.cardNumber'] && <span className="error-text">{errors['payment.cardNumber']}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày hết hạn *</label>
                <input
                  type="text"
                  name="payment.expiryDate"
                  value={formatExpiryDate(formData.paymentDetails.expiryDate)}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'payment.expiryDate',
                      value: e.target.value.replace(/\D/g, '')
                    }
                  })}
                  className={errors['payment.expiryDate'] ? 'error' : ''}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors['payment.expiryDate'] && <span className="error-text">{errors['payment.expiryDate']}</span>}
              </div>
              
              <div className="form-group">
                <label>CVV *</label>
                <input
                  type="text"
                  name="payment.cvv"
                  value={formData.paymentDetails.cvv}
                  onChange={handleInputChange}
                  className={errors['payment.cvv'] ? 'error' : ''}
                  placeholder="123"
                  maxLength={4}
                />
                {errors['payment.cvv'] && <span className="error-text">{errors['payment.cvv']}</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div className="form-section">
        <h3>📝 Ghi chú đơn hàng</h3>
        <div className="form-group">
          <label>Yêu cầu đặc biệt (Tùy chọn)</label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            placeholder="Ghi chú về món ăn, thời gian giao hàng..."
            rows={3}
          />
        </div>
      </div>

      {/* Order Total */}
      <div className="order-total-section">
        <div className="total-line">
          <span>Tạm tính:</span>
          <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>
        {deliveryFee > 0 && (
          <div className="total-line">
            <span>Phí giao hàng:</span>
            <span>{deliveryFee.toLocaleString('vi-VN')}đ</span>
          </div>
        )}
        <div className="total-line final-total">
          <span>Tổng cộng:</span>
          <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      {/* Submit Button */}
      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}

      <button 
        type="submit" 
        className="checkout-submit-btn"
        disabled={processing}
      >
        {processing ? (
          <>
            <span className="spinner"></span>
            Đang xử lý...
          </>
        ) : (
          `Đặt hàng - ${finalTotal.toLocaleString('vi-VN')}đ`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;