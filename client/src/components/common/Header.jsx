import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext'; // Change to useTheme hook
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { isDark } = useTheme(); // Use isDark instead of isDarkMode
  const location = useLocation();
  const history = useHistory();
  
  const cartItemsCount = totalItems;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isDark ? 'dark' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-content">
            <span className="logo-icon">🍔</span>
            <div className="logo-text">
              <span className="logo-name">FastFood</span>
              <span className="logo-tagline">Nhanh & Ngon</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                <span className="nav-icon">🍽️</span>
                <span>Thực đơn</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                <span className="nav-icon">ℹ️</span>
                <span>Về chúng tôi</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              >
                <span className="nav-icon">📞</span>
                <span>Liên lạc</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          

          {/* Action Buttons */}
          <div className="action-buttons">
            {/* Theme Toggle */}
            <ThemeToggle className="theme-btn" />

            {/* Cart */}
            <Link to="/cart" className="action-btn cart-btn">
              <span className="btn-icon">🛒</span>
              <span className="btn-text">Cart</span>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-section">
                <div className="user-dropdown-container">
                  <div className="user-greeting">
                    <span className="user-name">Xin chào, {user?.name || 'User'}!</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      <span className="item-icon">👤</span>
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <span className="item-icon">📋</span>
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </div>
                </div>
                
                <button onClick={handleLogout} className="logout-btn">
                  <span className="btn-text">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">
                  <span className="btn-icon">🔐</span>
                  <span>Đăng nhập</span>
                </Link>
                <Link to="/register" className="auth-btn register-btn">
                  <span className="btn-icon">📝</span>
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mobile-search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <span>🔍</span>
              </button>
            </div>
          </form>

          {/* Mobile Navigation Links */}
          <ul className="mobile-nav-links">
            <li>
              <Link 
                to="/" 
                className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                <span>Trang chủ</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className={`mobile-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🍽️</span>
                <span>Thực đơn</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">ℹ️</span>
                <span>Về chúng tôi</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">📞</span>
                <span>Liên hệ</span>
              </Link>
            </li>
          </ul>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            <div className="mobile-theme">
              <span>Chế độ tối</span>
              <ThemeToggle showText={false} />
            </div>
            
            {user ? (
              <div className="mobile-user">
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    <span>👤</span>
                  </div>
                  <div>
                    <span className="user-name">{user.username}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <div className="mobile-user-actions">
                  <Link to="/profile" className="mobile-action-btn" onClick={() => setIsMenuOpen(false)}>
                    <span>👤</span>
                    <span>Tài khoản</span>
                  </Link>
                  <Link to="/orders" className="mobile-action-btn" onClick={() => setIsMenuOpen(false)}>
                    <span>📦</span>
                    <span>Đơn hàng</span>
                  </Link>
                  <button onClick={handleLogout} className="mobile-action-btn logout">
                    <span>🚪</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth">
                <Link to="/login" className="mobile-auth-btn login" onClick={() => setIsMenuOpen(false)}>
                  <span>🔐</span>
                  <span>Đăng nhập</span>
                </Link>
                <Link to="/register" className="mobile-auth-btn register" onClick={() => setIsMenuOpen(false)}>
                  <span>📝</span>
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;