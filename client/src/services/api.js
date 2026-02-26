import axios from 'axios';
import { API_URL } from '../config';


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`; // Sửa API_BASE_URL -> API_URL
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ============================================================================
// PRODUCT APIs
// ============================================================================

export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });

  const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const result = await apiRequest(endpoint);
  return result.data || result;
};

export const getProductById = async (id) => {
  const result = await apiRequest(`/products/${id}`);
  return result.data || result;
};

export const getProductBySlug = async (slug) => {
  const result = await apiRequest(`/products/slug/${slug}`);
  return result.data || result;
};

export const getFeaturedProducts = async (limit = 8) => {
  const result = await apiRequest(`/products/featured?limit=${limit}`);
  return result.data || result;
};

export const getProductsByCategory = async (categorySlug, limit = null) => {
  const endpoint = `/products/category/${categorySlug}${limit ? `?limit=${limit}` : ''}`;
  const result = await apiRequest(endpoint);
  return result.data || result;
};

export const searchProducts = async (searchTerm, filters = {}) => {
  const queryParams = new URLSearchParams({ q: searchTerm });
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });

  const result = await apiRequest(`/products/search?${queryParams.toString()}`);
  return result.data || result;
};

// ============================================================================
// CATEGORY APIs
// ============================================================================

export const getCategories = async () => {
  const result = await apiRequest('/categories');
  return result.data || result;
};

export const getCategoryById = async (id) => {
  const result = await apiRequest(`/categories/${id}`);
  return result.data || result;
};

export const getCategoryBySlug = async (slug) => {
  const result = await apiRequest(`/categories/slug/${slug}`);
  return result.data || result;
};

// ============================================================================
// REVIEW APIs (Mock for now)
// ============================================================================

export const getProductReviews = async (productId) => {
  // Mock reviews for now
  const mockReviews = [
    {
      id: 1,
      productId: parseInt(productId),
      name: 'Nguyễn Văn A',
      rating: 5,
      title: 'Rất ngon!',
      comment: 'Món ăn ngon, giao hàng nhanh. Sẽ đặt lại!',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      productId: parseInt(productId),
      name: 'Trần Thị B',
      rating: 4,
      title: 'Tuyệt vời!',
      comment: 'Phục vụ nhiệt tình, đồ ăn tươi ngon.',
      date: '2024-01-10',
      verified: true
    }
  ];

  return new Promise(resolve => {
    setTimeout(() => resolve(mockReviews), 300);
  });
};

export const submitReview = async (reviewData) => {
  // Mock review submission
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Đánh giá đã được gửi thành công!',
        review: {
          ...reviewData,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          verified: false
        }
      });
    }, 1000);
  });
};

// ============================================================================
// USER AUTHENTICATION APIs (Mock for now)
// ============================================================================

export const loginUser = async (credentials) => {
  try {
    console.log('📤 Sending login request:', credentials);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    console.log('📥 Login API response:', result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;
    
  } catch (error) {
    console.error('🚨 Login API Error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log('📝 Registering user with data:', userData);

    // Validate dữ liệu trước khi gửi
    const requiredFields = ['full_name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!userData[field] || typeof userData[field] !== 'string') {
        throw new Error(`Field ${field} is required and must be a string`);
      }
    }

    // Đảm bảo tất cả fields đều là string và đã trim
    const cleanData = {
      full_name: String(userData.full_name || '').trim(),
      email: String(userData.email || '').trim(),
      password: String(userData.password || '').trim(),
      phone: String(userData.phone || '').trim(),
      address: String(userData.address || '').trim()
    };

    // Validate sau khi clean
    if (!cleanData.full_name) throw new Error('Tên không được để trống');
    if (!cleanData.email) throw new Error('Email không được để trống');
    if (!cleanData.password) throw new Error('Mật khẩu không được để trống');

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    return result;

  } catch (error) {
    console.error('🚨 Register API Error:', error);
    throw error;
  }
};

// THÊM FUNCTION NÀY - đây là function bị thiếu
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          resolve({
            success: true,
            user
          });
        } catch (error) {
          reject(new Error('Invalid user data'));
        }
      } else {
        reject(new Error('No authentication token found'));
      }
    }, 300);
  });
};

export const logoutUser = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      resolve({
        success: true,
        message: 'Đăng xuất thành công'
      });
    }, 200);
  });
};

export const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');

  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Cập nhật thất bại');

  // Lưu lại user mới vào localStorage nếu muốn
  if (result.data) {
    localStorage.setItem('user', JSON.stringify(result.data));
  }

  return result;
};

export const changePassword = async (passwordData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        reject(new Error('Vui lòng điền đầy đủ thông tin'));
        return;
      }
      
      // Mock validation - in real app, verify current password
      if (passwordData.currentPassword === 'wrongpassword') {
        reject(new Error('Mật khẩu hiện tại không đúng'));
        return;
      }
      
      resolve({
        success: true,
        message: 'Đổi mật khẩu thành công'
      });
    }, 1000);
  });
};

// ============================================================================
// ORDER APIs (Mock for now)
// ============================================================================

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ [createOrder] success:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ [createOrder] error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Lỗi không xác định khi đặt hàng' };
  }
};


export const getOrders = async (userId) => {
  // Mock order history
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      resolve([
        {
          id: 1,
          total: 125000,
          status: 'delivered',
          createdAt: '2024-01-15T10:30:00Z',
          items: [
            { name: 'Classic Burger', quantity: 2, price: 75000 },
            { name: 'French Fries', quantity: 1, price: 35000 }
          ]
        },
        {
          id: 2,
          total: 89000,
          status: 'preparing',
          createdAt: '2024-01-16T14:20:00Z',
          items: [
            { name: 'Chicken Wings', quantity: 1, price: 89000 }
          ]
        }
      ]);
    }, 500);
  });
};

export const getOrderById = async (orderId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        reject(new Error('Unauthorized'));
        return;
      }
      
      resolve({
        id: orderId,
        total: 125000,
        status: 'delivered',
        createdAt: '2024-01-15T10:30:00Z',
        deliveryAddress: '123 Nguyễn Trãi, Q.1, TP.HCM',
        paymentMethod: 'cash',
        items: [
          { 
            id: 1,
            name: 'Classic Burger', 
            quantity: 2, 
            price: 75000,
            image: '/images/products/burger-classic.jpg'
          },
          { 
            id: 2,
            name: 'French Fries', 
            quantity: 1, 
            price: 35000,
            image: '/images/products/fries-regular.jpg'
          }
        ]
      });
    }, 500);
  });
};

// User Orders API
export const getUserOrders = async () => {
  const response = await axios.get(`${API_URL}/orders/my-orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const cancelOrder = async (orderId, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `userOrders_${userId}`;
      const savedOrders = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedOrders = savedOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'cancelled', cancelled_at: new Date().toISOString() }
          : order
      );
      localStorage.setItem(key, JSON.stringify(updatedOrders));
      resolve({ success: true });
    }, 500);
  });
};

// Toggle Featured Product
export const toggleFeatured = (id) =>
  fetch(`/api/products/${id}/featured`, { method: 'PATCH', credentials: 'include' })
    .then(res => res.json());
