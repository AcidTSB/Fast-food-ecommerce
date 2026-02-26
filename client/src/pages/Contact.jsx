import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './Contact.css';

const Contact = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mô phỏng gửi form
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset trạng thái sau 3 giây
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Ghé Thăm Chúng Tôi',
      details: ['123 Đường Ẩm Thực', 'Khu Trung Tâm', 'TP.HCM, Việt Nam'],
      action: 'Xem Đường Đi'
    },
    {
      icon: '📞',
      title: 'Gọi Cho Chúng Tôi',
      details: ['1900 1234', '0123 456 789', 'Thứ 2 - CN: 9h-23h'],
      action: 'Gọi Ngay'
    },
    {
      icon: '📧',
      title: 'Email Cho Chúng Tôi',
      details: ['lienhe@fastfood.vn', 'hotro@fastfood.vn', 'Phản hồi trong 24h'],
      action: 'Gửi Email'
    },
    {
      icon: '🚚',
      title: 'Giao Hàng',
      details: ['Miễn phí giao hàng từ 200k', '30-45 phút trung bình', 'Theo dõi đơn hàng trực tiếp'],
      action: 'Đặt Hàng Ngay'
    }
  ];

  const locations = [
    {
      name: 'Chi Nhánh Trung Tâm',
      address: '123 Đường Ẩm Thực, Quận 1',
      phone: '1900 1234',
      hours: 'Thứ 2-CN: 10h-23h',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    },
    {
      name: 'Chi Nhánh Trung Tâm Mua Sắm',
      address: '456 TTTM Vincom, Tầng 2',
      phone: '0123 456 789',
      hours: 'Thứ 2-CN: 10h-22h',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
    },
    {
      name: 'Chi Nhánh Sân Bay',
      address: '789 Đường Sân Bay, Ga Đi',
      phone: '0987 654 321',
      hours: 'Phục vụ 24/7',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
    }
  ];

  const faqs = [
    {
      question: 'Giờ giao hàng của bạn là gì?',
      answer: 'Chúng tôi giao hàng từ 10h sáng đến 23h tối, thứ Hai đến Chủ nhật. Một số địa điểm có thể có giờ mở rộng.'
    },
    {
      question: 'Bạn có cung cấp giao hàng không tiếp xúc không?',
      answer: 'Có! Chúng tôi cung cấp giao hàng không tiếp xúc. Chỉ cần ghi chú trong đơn hàng và tài xế sẽ để đơn hàng tại cửa nhà bạn.'
    },
    {
      question: 'Bạn chấp nhận những phương thức thanh toán nào?',
      answer: 'Chúng tôi chấp nhận tất cả các thẻ tín dụng, thẻ ghi nợ chính, Momo, ZaloPay, và thanh toán khi giao hàng.'
    },
    {
      question: 'Tôi có thể theo dõi đơn hàng của mình không?',
      answer: 'Tất nhiên! Sau khi đơn hàng được xác nhận, bạn sẽ nhận được link theo dõi để giám sát trạng thái đơn hàng theo thời gian thực.'
    },
    {
      question: 'Bạn có phục vụ các hạn chế chế độ ăn uống không?',
      answer: 'Có, chúng tôi cung cấp các lựa chọn chay, thuần chay, không gluten và ít carb. Kiểm tra menu để biết thông tin chế độ ăn chi tiết.'
    }
  ];

  return (
    <div className={`contact-page ${isDark ? 'dark' : ''}`}>
      {/* Phần Hero */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop"
            alt="Liên Hệ Với Chúng Tôi"
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
            <p className="hero-subtitle">
              Chúng tôi rất mong được nghe từ bạn! Dù bạn có câu hỏi, phản hồi, 
              hay chỉ muốn chào hỏi, chúng tôi luôn sẵn sàng hỗ trợ.
            </p>
          </div>
        </div>
      </section>

      {/* Thẻ Thông Tin Liên Hệ */}
      <section className="contact-info">
        <div className="container">
          <div className="info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">{info.icon}</div>
                <h3 className="info-title">{info.title}</h3>
                <div className="info-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
                <button className="info-action">{info.action}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Liên Hệ & Bản Đồ */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-grid">
            <div className="form-container">
              <h2 className="form-title">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <p className="form-subtitle">
                Điền vào form dưới đây và chúng tôi sẽ phản hồi bạn sớm nhất có thể.
              </p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ Tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Họ và tên đầy đủ của bạn"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Số Điện Thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0123 456 789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Chủ Đề *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="general">Câu Hỏi Chung</option>
                      <option value="order">Vấn Đề Đặt Hàng</option>
                      <option value="feedback">Phản Hồi</option>
                      <option value="complaint">Khiếu Nại</option>
                      <option value="partnership">Hợp Tác</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Tin Nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Hãy cho chúng tôi biết chúng tôi có thể giúp bạn như thế nào..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-icon">⏳</span>
                      Đang Gửi...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📧</span>
                      Gửi Tin Nhắn
                    </>
                  )}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.
                  </div>
                )}
              </form>
            </div>
            
            <div className="map-container">
              <h3 className="map-title">Tìm Chúng Tôi</h3>
              <div className="map-placeholder">
                <div className="map-content">
                  <span className="map-icon">🗺️</span>
                  <p>Bản Đồ Tương Tác</p>
                  <p className="map-address">123 Đường Ẩm Thực, Khu Trung Tâm</p>
                  <button className="map-btn">Mở Trong Bản Đồ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Địa Điểm */}
      <section className="locations">
        <div className="container">
          <h2 className="section-title">Các Địa Điểm Của Chúng Tôi</h2>
          <div className="locations-grid">
            {locations.map((location, index) => (
              <div key={index} className="location-card">
                <div className="location-image">
                  <img src={location.image} alt={location.name} />
                  <div className="location-overlay">
                    <button className="view-menu-btn">Xem Menu</button>
                  </div>
                </div>
                <div className="location-info">
                  <h3 className="location-name">{location.name}</h3>
                  <div className="location-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{location.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📞</span>
                      <span>{location.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🕒</span>
                      <span>{location.hours}</span>
                    </div>
                  </div>
                  <div className="location-actions">
                    <button className="location-btn primary">Đặt Hàng Ngay</button>
                    <button className="location-btn secondary">Xem Đường Đi</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần Câu Hỏi Thường Gặp */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Câu Hỏi Thường Gặp</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">
                  <span className="faq-icon">❓</span>
                  {faq.question}
                </h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;