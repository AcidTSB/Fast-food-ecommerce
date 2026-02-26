import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Ưu tiên lấy adminToken, nếu không có thì lấy authToken
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
const api = {
  // Auth
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Products
  fetchProducts: async (params) => {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  fetchProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Orders
  fetchOrders: async (params) => {
    try {
      const response = await apiClient.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  fetchOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  updateOrderStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Users
  fetchUsers: async (params) => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  fetchUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getRecentOrders: async (limit = 5) => {
    try {
      const response = await apiClient.get(`/dashboard/recent-orders?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  getTopProducts: async (limit = 4) => {
    try {
      const response = await apiClient.get(`/dashboard/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  // Reports
  getTopCustomers: async (limit = 5) => {
    try {
      const response = await apiClient.get(`/reports/top-customers?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getTopSellingProducts: async (limit = 5) => {
    try {
      const response = await apiClient.get(`/reports/top-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  
  // Categories
  fetchCategories: async () => {
    try {
      console.log('Gọi API categories với URL:', `${apiClient.defaults.baseURL}/categories`);
      const response = await apiClient.get('/categories');
      console.log('Response từ API categories:', response);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // Thử lấy giá trị từ bất kỳ trường nào có thể chứa mảng categories
        const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          return possibleArrays[0];
        }
      }
      
      console.warn('Dữ liệu categories không đúng định dạng:', response.data);
      return ['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad'];
    } catch (error) {
      console.warn('Không thể lấy danh mục từ API:', error);
      return ['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad'];
    }
  }
};

// Error handler
function handleApiError(error) {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error
    const serverError = error.response.data;
    errorMessage = serverError.message || errorMessage;
    console.error('API Error:', serverError);
  } else if (error.request) {
    // No response received
    errorMessage = 'No response from server. Please check your internet connection.';
    console.error('API Error: No response', error.request);
  } else {
    // Request setup error
    errorMessage = error.message || errorMessage;
    console.error('API Error:', error.message);
  }
  
  return new Error(errorMessage);
}

export default api;