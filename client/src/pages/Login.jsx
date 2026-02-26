import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import LoginForm from '../components/auth/LoginForm';
import './Login.css';

const Login = () => {
    const { isDark } = useTheme();

    return (
        <div className={`login-page ${isDark ? 'dark' : ''}`}>
            <div className="login-container">
                <div className="login-content">
                    {/* Phần Thông Tin */}
                    <div className="login-info">
                        <div className="login-brand">
                            <div className="brand-logo">🍔</div>
                            <h1 className="brand-name">FastFood</h1>
                        </div>
                        
                        <div className="login-welcome">
                            <h2>Chào Mừng Trở Lại!</h2>
                            <p>Đăng nhập để tiếp tục đặt những món ăn yêu thích của bạn</p>
                        </div>

                        <div className="login-features">
                            <div className="feature-item">
                                <span className="feature-icon">🚀</span>
                                <span>Đặt hàng nhanh chóng</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💰</span>
                                <span>Ưu đãi độc quyền</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📱</span>
                                <span>Theo dõi đơn hàng</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">⭐</span>
                                <span>Tích lũy điểm thưởng</span>
                            </div>
                        </div>

                        <div className="login-stats">
                            <div className="stat">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Khách hàng</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">4.9⭐</div>
                                <div className="stat-label">Đánh giá</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Món ăn</div>
                            </div>
                        </div>
                    </div>

                    {/* Phần Form */}
                    <div className="login-form-section">
                        <div className="form-header">
                            <h3>Đăng Nhập Tài Khoản</h3>
                            <p>Vui lòng nhập thông tin đăng nhập của bạn</p>
                        </div>

                        <LoginForm />

                        <div className="form-footer">
                            <div className="signup-prompt">
                                <span>Chưa có tài khoản? </span>
                                <Link to="/register" className="signup-link">
                                    Đăng ký ngay
                                </Link>
                            </div>
                            
                            <div className="divider">
                                <span>hoặc</span>
                            </div>

                            <div className="social-login">
                                <button className="social-btn google">
                                    <span className="social-icon">📧</span>
                                    Đăng nhập với Google
                                </button>
                                <button className="social-btn facebook">
                                    <span className="social-icon">📘</span>
                                    Đăng nhập với Facebook
                                </button>
                            </div>

                            <div className="help-links">
                                <Link to="/contact" className="help-link">
                                    Cần hỗ trợ?
                                </Link>
                                <Link to="/forgot-password" className="help-link">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;