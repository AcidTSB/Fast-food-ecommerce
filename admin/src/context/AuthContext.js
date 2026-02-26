import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, logout, adminLogin } from '../services/authService';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const stored = localStorage.getItem('adminUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ưu tiên lấy adminUser, nếu không có thì lấy user thường
    const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('user');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminLogin(email, password);
      if (!response.success || !response.user || response.user.role !== 'admin') {
        setError(response.message || 'Sai email hoặc mật khẩu');
        setAdminUser(null);
        return null;
      }
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      localStorage.setItem('adminToken', response.token);
      setAdminUser(response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Sai email hoặc mật khẩu');
      setAdminUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (err) {
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // Create value object with auth state and functions
  const value = {
    adminUser,
    loading,
    error,
    isAuthenticated: !!adminUser,
    login: loginUser,
    logout: logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);