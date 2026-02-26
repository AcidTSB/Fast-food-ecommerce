import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import RegisterForm from '../components/auth/RegisterForm';
import './Register.css';

const Register = () => {
    const { isDark } = useTheme();

    const benefits = [
        {
            icon: '🎁',
            title: 'Ưu Đãi Chào Mừng',
            description: 'Giảm 20% cho đơn hàng đầu tiên khi đăng ký thành công'
        },
        {
            icon: '💰',
            title: 'Tích Điểm Thưởng',
            description: 'Tích lũy điểm với mỗi đơn hàng và đổi quà hấp dẫn'
        },
        {
            icon: '🚚',
            title: 'Miễn Phí Giao Hàng',
            description: 'Miễn phí giao hàng cho thành viên với đơn từ 150k'
        },
        {
            icon: '📱',
            title: 'Thông Báo Ưu Đãi',
            description: 'Nhận thông báo sớm nhất về các chương trình khuyến mãi'
        }
    ];

    return (
        <div className={`register-page ${isDark ? 'dark' : ''}`}>
            <div className="register-container">
                <div className="register-content">
                    {/* Phần Thông Tin */}
                    <div className="register-info">
                        <div className="register-brand">
                            <div className="brand-logo">🍔</div>
                            <h1 className="brand-name">FastFood</h1>
                        </div>
                        
                        <div className="register-welcome">
                            <h2>Tham Gia Cùng Chúng Tôi!</h2>
                            <p>Tạo tài khoản để trải nghiệm dịch vụ đặt đồ ăn tuyệt vời</p>
                        </div>

                        <div className="register-benefits">
                            <h3>Quyền Lợi Thành Viên</h3>
                            <div className="benefits-list">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="benefit-item">
                                        <div className="benefit-icon">{benefit.icon}</div>
                                        <div className="benefit-content">
                                            <h4>{benefit.title}</h4>
                                            <p>{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="register-testimonial">
                            <div className="testimonial-quote">
                                "FastFood đã trở thành lựa chọn hàng đầu của tôi. 
                                Thức ăn ngon, giao hàng nhanh và dịch vụ tuyệt vời!"
                            </div>
                            <div className="testimonial-author">
                                <strong>Nguyễn Thị Mai</strong>
                                <span>Khách hàng thân thiết</span>
                            </div>
                            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>

                    {/* Phần Form */}
                    <div className="register-form-section">
                        <div className="form-header">
                            <h3>Tạo Tài Khoản Mới</h3>
                            <p>Điền thông tin để bắt đầu hành trình ẩm thực cùng chúng tôi</p>
                        </div>

                        <RegisterForm />

                        <div className="form-footer">
                            <div className="login-prompt">
                                <span>Đã có tài khoản? </span>
                                <Link to="/login" className="login-link">
                                    Đăng nhập ngay
                                </Link>
                            </div>
                            
                            <div className="divider">
                                <span>hoặc</span>
                            </div>

                            <div className="social-register">
                                <button className="social-btn google">
                                    <span className="social-icon">📧</span>
                                    Đăng ký với Google
                                </button>
                                <button className="social-btn facebook">
                                    <span className="social-icon">📘</span>
                                    Đăng ký với Facebook
                                </button>
                            </div>

                            <div className="terms-notice">
                                <p>
                                    Bằng việc đăng ký, bạn đồng ý với{' '}
                                    <Link to="/terms" className="terms-link">
                                        Điều khoản dịch vụ
                                    </Link>
                                    {' '}và{' '}
                                    <Link to="/privacy" className="terms-link">
                                        Chính sách bảo mật
                                    </Link>
                                    {' '}của chúng tôi.
                                </p>
                            </div>

                            <div className="help-links">
                                <Link to="/contact" className="help-link">
                                    Cần hỗ trợ đăng ký?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;