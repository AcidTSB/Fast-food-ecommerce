import axios from 'axios';

const API_URL = 'http://localhost:5000';

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Handle response and errors
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - Server might be down');
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không.');
    }
    
    if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Network error');
      throw new Error('Lỗi mạng. Vui lòng kiểm tra kết nối internet.');
    }
    
    if (error.response?.status === 401) {
      console.error('🔐 Unauthorized - removing token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw error;
  }
);

// Public APIs
export const getProducts = async (filters = {}) => {
  try {
    const response = await API.get('/api/products', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getTopProducts = async (limit = 5) => {
  try {
    const response = await API.get('/api/products', { 
      params: { limit, featured: true } 
    });
    return response.data;
  } catch (error) {
    console.error('Error getting top products:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Admin APIs
export const createProduct = async (productData) => {
  try {
    const response = await API.post('/api/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Alias for createProduct (for compatibility)
export const addProduct = createProduct;

export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Toggle product featured status
export const toggleProductFeatured = async (id) => {
  try {
    const response = await API.patch(`/api/products/${id}/featured`);
    return response.data;
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Bulk operations
export const bulkUpdateProducts = async (updates) => {
  try {
    const response = await API.patch('/api/products/bulk', { updates });
    return response.data;
  } catch (error) {
    console.error('Error bulk updating products:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const bulkDeleteProducts = async (ids) => {
  try {
    const response = await API.delete('/api/products/bulk', { 
      data: { ids } 
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Search products
export const searchProducts = async (query, filters = {}) => {
  try {
    const response = await API.get('/api/products/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error.response?.data || { message: error.message };
  }
};