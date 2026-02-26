import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Terms.css'; // Import CSS riêng

const Terms = () => {
    const { isDark } = useTheme();

    return (
        <div className={`terms-container ${isDark ? 'dark' : ''}`}>
            <div className="terms-content">
                <div className="terms-breadcrumb">
                    <Link to="/" className="breadcrumb-link">
                        ← Về trang chủ
                    </Link>
                </div>
                
                <h1 className="terms-main-title">
                    📜 Điều Khoản Dịch Vụ
                </h1>
                
                <div className="terms-intro-card">
                    <h2>Chào mừng đến với FastFood!</h2>
                    <p>
                        Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau:
                    </p>
                </div>

                <div className="terms-item">
                    <h3>1. Chấp Nhận Điều Khoản</h3>
                    <p>
                        Bằng việc truy cập và sử dụng trang web FastFood, bạn đồng ý tuân thủ và bị ràng buộc 
                        bởi các điều khoản và điều kiện sử dụng được quy định trong tài liệu này.
                    </p>
                </div>

                <div className="terms-item">
                    <h3>2. Dịch Vụ Đặt Hàng</h3>
                    <p>
                        FastFood cung cấp dịch vụ đặt đồ ăn trực tuyến, cho phép khách hàng đặt hàng từ các 
                        nhà hàng đối tác và nhận hàng tại địa chỉ mong muốn.
                    </p>
                </div>

                <div className="terms-item">
                    <h3>3. Tài Khoản Người Dùng</h3>
                    <p>
                        Để sử dụng dịch vụ, bạn cần tạo tài khoản với thông tin chính xác. Bạn có trách nhiệm 
                        bảo mật thông tin tài khoản và chịu trách nhiệm về tất cả hoạt động dưới tài khoản của mình.
                    </p>
                </div>

                <div className="terms-item">
                    <h3>4. Thanh Toán và Giao Hàng</h3>
                    <p>
                        Khi đặt hàng, bạn cam kết thanh toán đầy đủ theo giá trị đơn hàng. Thời gian giao hàng 
                        là ước tính và có thể thay đổi tùy thuộc vào điều kiện thực tế.
                    </p>
                </div>

                <div className="terms-contact-card">
                    <h3>📞 Liên Hệ</h3>
                    <p>Nếu bạn có câu hỏi về điều khoản này, liên hệ:</p>
                    <div className="contact-info">
                        <span>📧 legal@fastfood.vn</span>
                        <span>📞 1900 1234</span>
                    </div>
                </div>

                <div className="terms-navigation">
                    <Link to="/privacy" className="terms-nav-link privacy-link">
                        🔒 Chính Sách Bảo Mật
                    </Link>
                    <Link to="/" className="terms-nav-link home-link">
                        🏠 Về Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;