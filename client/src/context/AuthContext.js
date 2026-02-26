import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  // ... các hàm khác
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra authentication khi app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔍 Checking auth - Token exists:', !!token);
        console.log('🔍 Checking auth - User data exists:', !!userData);
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('✅ Auth restored - User:', parsedUser);
          
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          console.log('❌ No auth data found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    try {
      console.log('🔐 Login called with:', userData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful - Auth state updated');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    try {
      console.log('🚪 Logout called');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    setUser, // <-- thêm dòng này
    isAuthenticated,
    loading,
    login,
    logout
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ THÊM CUSTOM HOOK useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};