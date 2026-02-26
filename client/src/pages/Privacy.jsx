import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Privacy.css';

const Privacy = () => {
    const { isDark } = useTheme();

    return (
        <div className={`privacy-container ${isDark ? 'dark' : ''}`}>
            <div className="privacy-content">
                <div className="privacy-breadcrumb">
                    <Link to="/" className="breadcrumb-link">
                        ← Về trang chủ
                    </Link>
                </div>
                
                <h1 className="privacy-main-title">
                    🔒 Chính Sách Bảo Mật
                </h1>
                
                <div className="privacy-commitment-card">
                    <h2>Cam Kết Bảo Mật</h2>
                    <p>
                        Tại FastFood, việc bảo vệ thông tin cá nhân của bạn là ưu tiên hàng đầu.
                    </p>
                    <div className="security-badges">
                        <div className="security-badge">
                            <span>🔐</span>
                            <span>SSL 256-bit</span>
                        </div>
                        <div className="security-badge">
                            <span>🛡️</span>
                            <span>Tuân Thủ GDPR</span>
                        </div>
                        <div className="security-badge">
                            <span>✅</span>
                            <span>Xác Thực 2FA</span>
                        </div>
                    </div>
                </div>

                <div className="privacy-section">
                    <h3>1. Thông Tin Chúng Tôi Thu Thập</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <strong>👤 Thông tin cá nhân:</strong>
                            <p>Họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng</p>
                        </div>
                        <div className="info-item">
                            <strong>📦 Thông tin đặt hàng:</strong>
                            <p>Lịch sử đặt hàng, sở thích món ăn, phương thức thanh toán</p>
                        </div>
                        <div className="info-item">
                            <strong>💻 Thông tin kỹ thuật:</strong>
                            <p>Địa chỉ IP, loại trình duyệt, thời gian truy cập</p>
                        </div>
                    </div>
                </div>

                <div className="privacy-section">
                    <h3>2. Mục Đích Sử Dụng</h3>
                    <ul className="purpose-list">
                        <li>🎯 Xử lý và giao hàng đơn hàng</li>
                        <li>📈 Cải thiện chất lượng dịch vụ</li>
                        <li>📧 Gửi thông báo và ưu đãi (nếu đồng ý)</li>
                        <li>🔧 Hỗ trợ khách hàng</li>
                    </ul>
                </div>

                <div className="privacy-section">
                    <h3>3. Bảo Mật Thông Tin</h3>
                    <div className="security-grid">
                        <div className="security-item">
                            <div className="security-icon">🔐</div>
                            <div>
                                <strong>Mã hóa dữ liệu</strong>
                                <p>SSL/TLS encryption</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-icon">🛡️</div>
                            <div>
                                <strong>Bảo mật server</strong>
                                <p>Firewall & monitoring</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="privacy-section">
                    <h3>4. Quyền Của Bạn</h3>
                    <div className="rights-grid">
                        <div className="rights-item">
                            <div className="rights-icon">👁️</div>
                            <strong>Xem thông tin</strong>
                            <button className="action-btn primary">Yêu cầu</button>
                        </div>
                        <div className="rights-item">
                            <div className="rights-icon">✏️</div>
                            <strong>Chỉnh sửa</strong>
                            <Link to="/profile" className="action-btn success">Cập nhật</Link>
                        </div>
                        <div className="rights-item">
                            <div className="rights-icon">🗑️</div>
                            <strong>Xóa dữ liệu</strong>
                            <button className="action-btn danger">Xóa tài khoản</button>
                        </div>
                    </div>
                </div>

                <div className="privacy-contact-card">
                    <h3>📞 Liên Hệ Bảo Mật</h3>
                    <p>Có câu hỏi về chính sách bảo mật? Liên hệ ngay:</p>
                    <div className="contact-info">
                        <span>📧 privacy@fastfood.vn</span>
                        <span>📞 1900 1234 (Ext: 3)</span>
                        <span>⏰ Phản hồi trong 72h</span>
                    </div>
                </div>

                <div className="privacy-navigation">
                    <Link to="/terms" className="privacy-nav-link terms-link">
                        📜 Điều Khoản Dịch Vụ
                    </Link>
                    <Link to="/" className="privacy-nav-link home-link">
                        🏠 Về Trang Chủ
                    </Link>
                </div>

                <div className="rights-item">
                    <span className="rights-icon">✏️</span>
                    <strong>Chỉnh Sửa Thông Tin</strong>
                    <button className="privacy-action-btn primary">
                        Cập Nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Privacy;