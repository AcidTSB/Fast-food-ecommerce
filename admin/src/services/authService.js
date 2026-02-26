import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Hoặc process.env.REACT_APP_API_URL

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get stored token
export const getStoredToken = () => {
  return localStorage.getItem('adminToken') || localStorage.getItem('token');
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem('adminUser') || localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Save user data
export const setCurrentUser = (userData) => {
  if (userData.role === 'admin') {
    localStorage.setItem('adminUser', JSON.stringify(userData));
  } else {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

// Clear user data
export const clearCurrentUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

// Get current user
export const getCurrentUser = () => {
  return getStoredUser();
};

// Check authentication status
export const checkAuthStatus = async () => {
  try {
    const token = getStoredToken();
    
    if (!token) {
      return { authenticated: false };
    }
    
    // Kiểm tra với server
    const response = await API.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      // Cập nhật thông tin user từ server
      const userData = response.data.data.user;
      setCurrentUser(userData);
      return { authenticated: true, user: userData };
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error('Error checking auth status:', error);
    // Xóa token nếu không hợp lệ
    clearCurrentUser();
    return { authenticated: false, error };
  }
};

// Regular user login
export const login = async (email, password) => {
  try {
    const response = await API.post('/api/auth/login', { email, password });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      
      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: error.message || 'Login failed' };
  }
};

// Đăng nhập admin
export const adminLogin = async (email, password) => {
  try {
    const response = await API.post('/api/auth/admin/login', { email, password });
    // SỬA Ở ĐÂY: Lấy trực tiếp từ response.data
    if (response.data.success) {
      const { token, user } = response.data; // KHÔNG phải response.data.data
      return { success: true, user, token };
    }
    return { success: false, message: response.data.message || 'Sai email hoặc mật khẩu' };
  } catch (error) {
    return { success: false, message: error.message || 'Sai email hoặc mật khẩu' };
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    if (error.response) {
      return error.response.data;
    }
    return { success: false, message: error.message || 'Registration failed' };
  }
};

// Logout
export const logout = () => {
  clearCurrentUser();
};