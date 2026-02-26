import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Thay useNavigate bằng useHistory
import { 
  login as loginService, 
  logout as logoutService,
  register as registerService,
  getCurrentUser,
  getStoredToken,
  setCurrentUser,
  clearCurrentUser,
  adminLogin
} from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory(); // Thay navigate bằng history

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const token = getStoredToken();
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const userData = getCurrentUser();
      
      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loginService(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        history.push('/'); // Sử dụng history.push thay vì navigate
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Admin login
  const adminLoginHandler = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminLogin(email, password);
      
      if (response.success) {
        setUser(response.data.user);
        history.push('/dashboard'); // Sử dụng history.push thay vì navigate
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message || 'Admin login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await registerService(userData);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    logoutService();
    setUser(null);
    history.push('/login'); // Sử dụng history.push thay vì navigate
  };

  // Update user info
  const updateUserInfo = (userData) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    adminLogin: adminLoginHandler,
    register,
    logout,
    updateUserInfo
  };
};

export default useAuth; // Sử dụng export default thay vì named export