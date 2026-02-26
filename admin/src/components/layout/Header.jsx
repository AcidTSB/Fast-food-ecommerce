import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useContext(AuthContext);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Tổng quan';
    if (path === '/products') return 'Quản lý sản phẩm';
    if (path === '/orders') return 'Quản lý đơn hàng';
    if (path === '/users') return 'Quản lý khách hàng';
    if (path === '/reports') return 'Báo cáo';
    if (path === '/settings') return 'Cài đặt';
    if (path.startsWith('/products/')) return 'Chi tiết sản phẩm';
    if (path.startsWith('/orders/')) return 'Chi tiết đơn hàng';
    if (path.startsWith('/users/')) return 'Thông tin khách hàng';
    return 'Tổng quan';
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <header className="header">
      <div className="page-header">
        <h1>{getPageTitle()}</h1>
      </div>
      
      <div className="header-actions">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="search-input" 
          />
        </div>
        
        <div className="header-buttons">
          <button className="icon-button" title="Thông báo">
            <span className="icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          
          <button className="logout-button" onClick={handleLogout} title="Đăng xuất">
            <span className="icon">↪️</span>
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;