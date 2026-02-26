import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const { login, adminUser } = useAuth();

  useEffect(() => {
    if (adminUser) {
      history.replace('/dashboard');
    }
  }, [adminUser, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login({ email, password });
      if (user && user.role === 'admin') {
        history.push('/dashboard');
      } else {
        setError('Sai email hoặc mật khẩu');
      }
    } catch (err) {
      setError('Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">c:\Users\ADMIN\AppData\Local\Temp\Không có tiêu d_.jpg
            <h1 className="login-title">Đăng nhập quản trị</h1>
            <p className="login-subtitle">Nhập thông tin để truy cập trang quản trị</p>
          </div>
          
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              Sai email hoặc mật khẩu
            </div>
          )}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Nhập mật khẩu"
              />
            </div>
            
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>

          <div className="login-help">
            <a
              href="#"
              className="login-link"
              onClick={e => {
                e.preventDefault();
                alert('Hãy liên hệ admin@fastfood.com để được cấp tài khoản!');
              }}
            >
              Chưa có tài khoản?
            </a>
          </div>

          <div className="login-footer">
            <p>Bảng điều khiển quản trị Fast-Food &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;