import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Sửa thành 5000 để khớp với authService

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  // Ưu tiên adminToken
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi tốt hơn
const handleApiError = (error, errorMessage) => {
  console.error(errorMessage, error);
  
  // Chi tiết lỗi
  if (error.response) {
    // Server trả về lỗi
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    return {
      success: false,
      message: error.response.data?.message || errorMessage,
      status: error.response.status,
      data: null
    };
  } else if (error.request) {
    // Không nhận được response
    console.error('No response received:', error.request);
    return {
      success: false,
      message: 'Server không phản hồi. Vui lòng kiểm tra kết nối hoặc thử lại sau.',
      status: 0,
      data: null
    };
  } else {
    // Lỗi khi cấu hình request
    console.error('Request error:', error.message);
    return {
      success: false,
      message: error.message || errorMessage,
      status: 0,
      data: null
    };
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (params = {}) => {
  try {
    console.log('🔍 Fetching orders with params:', params);
    const response = await API.get('/api/orders', { params });
    console.log('📦 Orders fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy danh sách đơn hàng');
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    console.log('🔍 Fetching order details for ID:', id);
    const response = await API.get(`/api/orders/${id}`);
    console.log('📦 Order detail fetched successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy chi tiết đơn hàng');
  }
};

// Update order status
export const updateOrderStatus = async (id, status, notes = '') => {
  try {
    console.log('🔄 Updating order status:', { id, status, notes });
    const response = await API.put(`/api/orders/${id}/status`, { status, notes });
    console.log('✅ Order status updated successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể cập nhật trạng thái đơn hàng');
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    console.log('📊 Fetching order statistics');
    const response = await API.get('/api/orders/stats');
    console.log('📊 Stats fetched successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy thống kê đơn hàng');
  }
};

// Create order (for users)
export const createOrder = async (orderData) => {
  try {
    console.log('📤 Creating new order');
    const response = await API.post('/api/orders', orderData);
    console.log('✅ Order created successfully');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể tạo đơn hàng');
  }
};

// Thêm alias để tương thích với component OrderDetail
export const fetchOrderById = getOrderById;