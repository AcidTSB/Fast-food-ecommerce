import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Thêm useTheme
import { loginUser } from '../../services/api';
import './AuthForm.css';

const LoginForm = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const { isDark } = useTheme(); // Sử dụng ThemeContext
    const history = useHistory(); 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    // Bỏ phần dark mode detection tự quản lý

    useEffect(() => {
        // Chuyển hướng nếu đã đăng nhập rồi
        if (isAuthenticated) {
            console.log("[LoginForm] User is already authenticated. Redirecting to /");
            history.replace('/');
        }
    }, [isAuthenticated, history]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log("--- [LoginForm] Bắt đầu quá trình đăng nhập ---");

        try {
            console.log("[LoginForm] Gọi hàm login() từ AuthContext...");
            const result = await loginUser(formData);
            console.log("[LoginForm] Hàm login() THÀNH CÔNG. Kết quả:", result);
            
            if (result.success) {
                // Sửa lại để lấy đúng user object
                const userObj = result.user || result.data;
                login(userObj, result.token);
                history.push('/');
            } else {
                setError(result.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            console.error("[LoginForm] Hàm login() THẤT BẠI. Lỗi:", err);
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            console.log("--- [LoginForm] Kết thúc quá trình đăng nhập ---");
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Implement Google login logic here
            setError('Tính năng đăng nhập Google sẽ có sớm!');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập Google thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-page ${isDark ? 'dark' : ''}`}>
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <div className="auth-visual-icon">🍕</div>
                        <h2>Chào Mừng Trở Lại!</h2>
                        <p>Đăng nhập vào tài khoản của bạn và tiếp tục hành trình ẩm thực tuyệt vời cùng FastFood.</p>
                        <div className="auth-visual-features">
                            <div className="feature-item">
                                <span className="feature-icon">🚀</span>
                                <span>Đặt hàng nhanh chóng</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💰</span>
                                <span>Ưu đãi độc quyền</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">⭐</span>
                                <span>Tích điểm thưởng</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="auth-form-container">
                    <div className="auth-form">
                        <div className="form-header">
                            <h2>Đăng Nhập</h2>
                            <p className="auth-form-subtitle">Chào mừng bạn trở lại! Vui lòng nhập thông tin đăng nhập</p>
                        </div>
                        
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                <span className="error-text">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <span className="label-icon">📧</span>
                                    Địa Chỉ Email
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Nhập email của bạn"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    <span className="label-icon">🔒</span>
                                    Mật Khẩu
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">Ghi nhớ đăng nhập</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-btn ${loading ? 'loading' : ''}`} 
                                disabled={loading}
                            >
                                {loading && <span className="loading-spinner">⏳</span>}
                                <span className="btn-text">
                                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                                </span>
                                {!loading && <span className="btn-icon">🚀</span>}
                            </button>
                        </form>

                        <div className="divider">
                            <span>hoặc</span>
                        </div>

                        <div className="social-login">
                            <button 
                                type="button"
                                onClick={handleGoogleLogin}
                                className="social-btn google"
                                disabled={loading}
                            >
                                <span className="social-icon">🔴</span>
                                <span>Tiếp tục với Google</span>
                            </button>
                        </div>

                        <div className="auth-links">
                            <p>Chưa có tài khoản?</p>
                            <Link to="/register" className="signup-link">
                                <span>Đăng ký miễn phí</span>
                                <span className="link-arrow">→</span>
                            </Link>
                        </div>

                        <div className="login-help">
                            <div className="help-item">
                                <span className="help-icon">🔐</span>
                                <span>Đăng nhập an toàn 100%</span>
                            </div>
                            <div className="help-item">
                                <span className="help-icon">🛡️</span>
                                <span>Bảo mật thông tin tuyệt đối</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;