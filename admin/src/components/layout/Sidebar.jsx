import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isCollapsed = collapsed !== undefined ? collapsed : false;

  const toggleSidebar = () => {
    if (typeof onToggle === 'function') {
      onToggle(!isCollapsed);
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Đóng sidebar trên mobile khi kích thước màn hình thay đổi
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Tổng quan' },
    { path: '/products', icon: '📦', label: 'Sản phẩm' },
    { path: '/orders', icon: '🛒', label: 'Đơn hàng' },
    { path: '/users', icon: '👥', label: 'Khách hàng' },
    { path: '/reports', icon: '📊', label: 'Báo cáo' },
    { path: '/settings', icon: '⚙️', label: 'Cài đặt' },
  ];

  const sidebarClass = `sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`;

  return (
    <>
      <div className="mobile-toggle" onClick={toggleMobileSidebar}>
        {isMobileOpen ? '✖️' : '☰'}
      </div>
      
      <aside className={sidebarClass}>
        <div className="sidebar-header">
          <h2 className="logo">
            {!isCollapsed && 'Fast Food'}
            {isCollapsed && 'FF'}
          </h2>
          <button className="collapse-btn" onClick={toggleSidebar} title={isCollapsed ? "Mở rộng" : "Thu gọn"}>
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  activeClassName="active"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            {!isCollapsed && (
              <>
                <span className="user-name">Quản trị viên</span>
                <span className="user-role">Người quản trị</span>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;