import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '', showText = false, size = 'medium' }) => {
  // Debug: Kiểm tra context có hoạt động không
  console.log('ThemeToggle rendering...');
  
  // React Hooks phải được gọi ở top level, không được trong try-catch
  const themeContext = useTheme();
  
  // Kiểm tra context sau khi đã gọi hook
  if (!themeContext) {
    console.error('ThemeContext not found!');
    return (
      <button className="theme-toggle error">
        ❌ Theme Error
      </button>
    );
  }

  const { isDark, toggleTheme } = themeContext;
  console.log('Context values:', { isDark, toggleTheme: typeof toggleTheme });

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked! Current theme:', isDark ? 'dark' : 'light');
    
    if (typeof toggleTheme === 'function') {
      toggleTheme();
    } else {
      console.error('toggleTheme is not a function:', toggleTheme);
    }
  };

  return (
    <button 
      className={`theme-toggle ${size} ${className} ${isDark ? 'dark' : 'light'}`}
      onClick={handleToggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      type="button"
    >
      <div className="toggle-container">
        <div className="toggle-track">
          <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
            <span className="toggle-icon">
              {isDark ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
        {showText && (
          <span className="toggle-text">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;