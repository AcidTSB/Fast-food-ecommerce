import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Thêm useTheme
import { registerUser } from '../../services/api';
import './AuthForm.css';

const RegisterForm = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const { isDark } = useTheme(); // Sử dụng ThemeContext
    const history = useHistory();
    
    // Đảm bảo tất cả state được khởi tạo đúng
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    // Bỏ phần dark mode detection tự quản lý

    // Chuyển hướng nếu đã đăng nhập
    useEffect(() => {
        if (isAuthenticated) {
            history.replace('/');
        }
    }, [isAuthenticated, history]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); // Xóa lỗi khi người dùng nhập
        
        // Kiểm tra độ mạnh mật khẩu
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 8) return 'fair';
        if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) return 'strong';
        if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return 'good';
        return 'fair';
    };

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 'weak': return 'Yếu';
            case 'fair': return 'Khá';
            case 'good': return 'Tốt';
            case 'strong': return 'Mạnh';
            default: return '';
        }
    };

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 'weak': return '#dc3545';
            case 'fair': return '#ffc107';
            case 'good': return '#28a745';
            case 'strong': return '#007bff';
            default: return '#6c757d';
        }
    };

    const validateForm = () => {
        // Reset error messages
        setError('');
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập họ và tên');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Vui lòng nhập địa chỉ email');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        if (!agreedToTerms) {
            setError('Vui lòng đồng ý với các điều khoản và điều kiện');
            return false;
        }

        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || '' // Đảm bảo không bao giờ undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate và trim an toàn
        const trimmedData = {
            name: (formData.name || '').trim(),
            email: (formData.email || '').trim(), 
            password: (formData.password || '').trim(),
            confirmPassword: (formData.confirmPassword || '').trim(),
            phone: (formData.phone || '').trim(),
            address: (formData.address || '').trim()
        };
        
        // Validation
        if (!trimmedData.name) {
            setError('Vui lòng nhập họ tên');
            return;
        }
        
        if (!trimmedData.email) {
            setError('Vui lòng nhập email');
            return;
        }
        
        if (!trimmedData.password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }
        
        if (trimmedData.password !== trimmedData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            
            // Gửi dữ liệu đã được trim
            const response = await registerUser({
                email: trimmedData.email,
                password: trimmedData.password,
                full_name: trimmedData.name, // Đúng tên trường backend yêu cầu
                phone: trimmedData.phone
            });
            
            if (response.success) {
                setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    address: ''
                });
                
                setTimeout(() => {
                    history.push('/');
                }, 2000);
            } else {
                setError(response.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message || 'Có lỗi xảy ra khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt();
        } else {
            setError('Tính năng đăng nhập Google sẽ có sớm!');
        }
    };

    return (
        <div className={`auth-page ${isDark ? 'dark' : ''}`}>
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <div className="auth-visual-icon">🍔</div>
                        <h2>Tham Gia FastFood!</h2>
                        <p>Tạo tài khoản và bắt đầu đặt những món ăn ngon được giao tận nhà bạn.</p>
                        
                        <div className="auth-visual-benefits">
                            <h3>Quyền lợi thành viên:</h3>
                            <div className="benefit-list">
                                <div className="benefit-item">
                                    <span className="benefit-icon">🎁</span>
                                    <span>Giảm 20% đơn đầu tiên</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">⚡</span>
                                    <span>Giao hàng ưu tiên</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">💰</span>
                                    <span>Tích điểm thưởng</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">🔔</span>
                                    <span>Thông báo ưu đãi sớm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="auth-form-container">
                    <div className="auth-form">
                        <div className="form-header">
                            <h2>Tạo Tài Khoản</h2>
                            <p className="auth-form-subtitle">Điền thông tin để bắt đầu hành trình ẩm thực</p>
                        </div>
                        
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                <span className="error-text">{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="success-message">
                                <span className="success-icon">✅</span>
                                <span className="success-text">{successMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="form-group">
                                <label htmlFor="name">
                                    <span className="label-icon">👤</span>
                                    Họ và Tên *
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Nhập họ và tên đầy đủ"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <span className="label-icon">📧</span>
                                    Địa Chỉ Email *
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Nhập địa chỉ email"
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
                                    Mật Khẩu *
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Tạo mật khẩu mạnh"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        autoComplete="new-password"
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
                                {passwordStrength && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className={`strength-fill ${passwordStrength}`}
                                                style={{ 
                                                    backgroundColor: getPasswordStrengthColor(passwordStrength),
                                                    width: passwordStrength === 'weak' ? '25%' : 
                                                           passwordStrength === 'fair' ? '50%' :
                                                           passwordStrength === 'good' ? '75%' : '100%'
                                                }}
                                            ></div>
                                        </div>
                                        <span 
                                            className="strength-text"
                                            style={{ color: getPasswordStrengthColor(passwordStrength) }}
                                        >
                                            Độ mạnh: {getPasswordStrengthText(passwordStrength)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <span className="label-icon">🔐</span>
                                    Xác Nhận Mật Khẩu *
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Nhập lại mật khẩu"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    >
                                        {showConfirmPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <div className="password-mismatch">
                                        <span className="mismatch-icon">❌</span>
                                        <span>Mật khẩu không khớp</span>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="checkbox-input"
                                        required
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">
                                        Tôi đồng ý với{' '}
                                        <Link to="/terms" className="terms-link">
                                            Điều khoản dịch vụ
                                        </Link>
                                        {' '}và{' '}
                                        <Link to="/privacy" className="terms-link">
                                            Chính sách bảo mật
                                        </Link>
                                    </span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                className={`submit-btn ${loading ? 'loading' : ''}`} 
                                disabled={loading}
                            >
                                {loading && <span className="loading-spinner">⏳</span>}
                                <span className="btn-text">
                                    {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
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
                            <p>Đã có tài khoản?</p>
                            <Link to="/login" className="signin-link">
                                <span>Đăng nhập tại đây</span>
                                <span className="link-arrow">→</span>
                            </Link>
                        </div>

                        <div className="security-notice">
                            <div className="security-item">
                                <span className="security-icon">🔒</span>
                                <span>Thông tin được mã hóa an toàn</span>
                            </div>
                            <div className="security-item">
                                <span className="security-icon">🛡️</span>
                                <span>Cam kết bảo mật tuyệt đối</span>
                            </div>
                            <div className="security-item">
                                <span className="security-icon">📧</span>
                                <span>Xác thực qua email</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;