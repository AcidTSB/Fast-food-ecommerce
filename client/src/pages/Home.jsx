import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import ProductList from '../components/product/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.css';

const Home = () => {
    const { isDark } = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts('', '');
                setProducts(response.data || response);
            } catch (err) {
                setError('Không thể tải sản phẩm');
                console.error('Lỗi khi tải sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const heroFeatures = [
        {
            icon: '🚀',
            title: 'Giao Hàng Siêu Nhanh',
            description: 'Chỉ 30 phút có mặt tại nhà bạn'
        },
        {
            icon: '🌟',
            title: 'Chất Lượng Cao',
            description: 'Nguyên liệu tươi ngon, chế biến cẩn thận'
        },
        {
            icon: '💰',
            title: 'Giá Cả Hợp Lý',
            description: 'Ưu đãi và khuyến mãi hấp dẫn'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Khách hàng hài lòng' },
        { number: '50+', label: 'Món ăn đa dạng' },
        { number: '24/7', label: 'Phục vụ không ngừng' },
        { number: '4.9⭐', label: 'Điểm đánh giá' }
    ];

    return (
        <div className={`home ${isDark ? 'dark' : ''}`}>
            <main>
                {/* Phần Hero - IMPROVED */}
                <section className="hero-section">
                    <div className="hero-background">
                        <div className="hero-overlay"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop&crop=center&q=80"
                            alt="Delicious food spread"
                            className="hero-bg-image"
                            loading="eager"
                        />
                    </div>
                    
                    <div className="hero-content">
                        <div className="container">
                            <div className="hero-main">
                                <div className="hero-text">
                                    <h1 className="hero-title">
                                        <span className="title-main">Chào Mừng Đến Với</span>
                                        <span className="title-highlight">FastFood!</span>
                                    </h1>
                                    <p className="hero-subtitle">
                                        Thức ăn ngon, giao hàng nhanh, phục vụ tận tâm - 
                                        Mang hương vị tuyệt vời đến tận nhà bạn
                                    </p>
                                    <div className="hero-actions">
                                        <button 
                                            className="cta-button primary"
                                            onClick={() => window.location.href = '/products'}
                                        >
                                            <span className="btn-icon">🍔</span>
                                            <span className="btn-text">Đặt Hàng Ngay</span>
                                            <span className="btn-arrow">→</span>
                                        </button>
                                        <button 
                                            className="cta-button secondary"
                                            onClick={() => window.location.href = '/about'}
                                        >
                                            <span className="btn-icon">📖</span>
                                            <span className="btn-text">Tìm Hiểu Thêm</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="hero-features">
                                    {heroFeatures.map((feature, index) => (
                                        <div key={index} className="feature-card">
                                            <div className="feature-icon">{feature.icon}</div>
                                            <div className="feature-content">
                                                <h3 className="feature-title">{feature.title}</h3>
                                                <p className="feature-description">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Phần Thống Kê */}
                <section className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Phần Sản Phẩm Nổi Bật */}
                <section className="featured-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Món Ăn Nổi Bật</h2>
                            <p className="section-subtitle">
                                Khám phá những món ăn được yêu thích nhất tại FastFood
                            </p>
                        </div>
                        
                        {loading ? (
                            <LoadingSpinner text="Đang tải những món ăn ngon..." />
                        ) : error ? (
                            <div className="error-message">
                                <div className="error-icon">😞</div>
                                <h3>Oops! Có lỗi xảy ra</h3>
                                <p>{error}</p>
                                <button 
                                    className="retry-button"
                                    onClick={() => window.location.reload()}
                                >
                                    <span className="btn-icon">🔄</span>
                                    Thử Lại
                                </button>
                            </div>
                        ) : (
                            <>
                                <ProductList products={products.slice(0, 8)} />
                                <div className="view-all-section">
                                    <button 
                                        className="view-all-btn"
                                        onClick={() => window.location.href = '/products'}
                                    >
                                        <span className="btn-icon">👀</span>
                                        Xem Tất Cả Món Ăn
                                        <span className="btn-arrow">→</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Phần Tại Sao Chọn FastFood - ĐỔI TÊN CLASS */}
                <section className="why-choose-section">
                    <div className="why-choose-container">
                        <div className="why-choose-header">
                            <h2 className="why-choose-title">Tại Sao Chọn FastFood?</h2>
                            <p className="why-choose-subtitle">
                                Chúng tôi cam kết mang đến trải nghiệm tuyệt vời nhất cho khách hàng
                            </p>
                        </div>
                        
                        <div className="why-choose-grid">
                            <div className="why-choose-card">
                                <div className="why-choose-icon">🚚</div>
                                <h3 className="why-choose-card-title">Giao Hàng Nhanh Chóng</h3>
                                <p className="why-choose-card-description">
                                    Giao hàng trong vòng 30 phút, đảm bảo thức ăn còn nóng hổi
                                </p>
                                <ul className="why-choose-features">
                                    <li>Miễn phí giao hàng từ 200k</li>
                                    <li>Theo dõi đơn hàng real-time</li>
                                    <li>Giao hàng 24/7</li>
                                </ul>
                            </div>
                            
                            <div className="why-choose-card">
                                <div className="why-choose-icon">🍳</div>
                                <h3 className="why-choose-card-title">Chất Lượng Đảm Bảo</h3>
                                <p className="why-choose-card-description">
                                    Nguyên liệu tươi ngon, quy trình chế biến nghiêm ngặt
                                </p>
                                <ul className="why-choose-features">
                                    <li>Nguyên liệu organic</li>
                                    <li>Kiểm tra chất lượng 24/7</li>
                                    <li>Đầu bếp chuyên nghiệp</li>
                                </ul>
                            </div>
                            
                            <div className="why-choose-card">
                                <div className="why-choose-icon">💳</div>
                                <h3 className="why-choose-card-title">Thanh Toán Linh Hoạt</h3>
                                <p className="why-choose-card-description">
                                    Đa dạng phương thức thanh toán, an toàn và tiện lợi
                                </p>
                                <ul className="why-choose-features">
                                    <li>Tiền mặt khi nhận hàng</li>
                                    <li>Chuyển khoản ngân hàng</li>
                                    <li>Ví điện tử: Momo, ZaloPay</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Phần Đánh Giá Khách Hàng */}
                <section className="testimonials-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                        </div>
                        
                        <div className="testimonials-grid">
                            <div className="testimonial-card">
                                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Thức ăn ngon, giao hàng nhanh. Tôi đã trở thành khách hàng thường xuyên!"</p>
                                <div className="testimonial-author">
                                    <strong>Nguyễn Văn An</strong>
                                    <span>Khách hàng từ 2020</span>
                                </div>
                            </div>
                            
                            <div className="testimonial-card">
                                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Chất lượng ổn định, giá cả phải chăng. Recommend cho mọi người!"</p>
                                <div className="testimonial-author">
                                    <strong>Trần Thị Bình</strong>
                                    <span>Khách hàng từ 2021</span>
                                </div>
                            </div>
                            
                            <div className="testimonial-card">
                                <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                                <p>"Dịch vụ tuyệt vời, nhân viên thân thiện. Sẽ tiếp tục ủng hộ!"</p>
                                <div className="testimonial-author">
                                    <strong>Lê Văn Cường</strong>
                                    <span>Khách hàng từ 2019</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Phần Newsletter */}
                <section className="newsletter-section">
                    <div className="container">
                        <div className="newsletter-content">
                            <div className="newsletter-text">
                                <h2>Đăng Ký Nhận Ưu Đãi</h2>
                                <p>Nhận thông tin khuyến mãi và món ăn mới nhất từ FastFood</p>
                            </div>
                            <div className="newsletter-form">
                                <input 
                                    type="email" 
                                    placeholder="Nhập email của bạn..."
                                    className="newsletter-input"
                                />
                                <button className="newsletter-btn">
                                    <span className="btn-icon">📧</span>
                                    Đăng Ký
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;