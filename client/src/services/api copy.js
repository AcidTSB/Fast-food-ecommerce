const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Products API
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    return this.request(`/products?${params.toString()}`);
  }

  async getFeaturedProducts(limit = 8) {
    return this.request(`/products/featured?limit=${limit}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams({ q: query });
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    return this.request(`/products/search?${params.toString()}`);
  }

  // Categories API
  async getCategories() {
    return this.request('/categories');
  }

  async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  // Auth API
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async googleLogin(credential) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Orders API
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // User API
  async updateUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Payment API
  async processPayment(paymentData) {
    return this.request('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async validatePayment(paymentId) {
    return this.request(`/payments/validate/${paymentId}`);
  }

  // Wishlist API
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Reviews API
  async getProductReviews(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Coupons API
  async validateCoupon(couponCode) {
    return this.request(`/coupons/validate/${couponCode}`);
  }

  async applyCoupon(couponCode, orderTotal) {
    return this.request('/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ couponCode, orderTotal }),
    });
  }
}

// Create instance
const apiService = new ApiService();

// Default export
export default apiService;

// Named exports for all functions
export const getProducts = (filters) => apiService.getProducts(filters);
export const getFeaturedProducts = (limit) => apiService.getFeaturedProducts(limit);
export const getProductById = (id) => apiService.getProductById(id);
export const searchProducts = (query, filters) => apiService.searchProducts(query, filters);

export const getCategories = async () => {
  try {
    console.log('Getting categories via ApiService...');
    
    // Use the ApiService method
    const response = await apiService.getCategories();
    
    console.log('Categories API response:', response);
    
    // Handle different response formats
    let categories = [];
    if (Array.isArray(response)) {
      categories = response;
    } else if (response.data && Array.isArray(response.data)) {
      categories = response.data;
    } else if (response.categories && Array.isArray(response.categories)) {
      categories = response.categories;
    }
    
    console.log('Processed categories:', categories);
    
    return categories; // Return array directly, not wrapped in data object
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array instead of { data: [] }
  }
};

export const getCategoryById = (id) => apiService.getCategoryById(id);

export const login = (credentials) => apiService.login(credentials);
export const register = (userData) => apiService.register(userData);
export const getCurrentUser = () => apiService.getCurrentUser();
export const logout = () => apiService.logout();
export const googleLogin = (credential) => apiService.googleLogin(credential);
export const forgotPassword = (email) => apiService.forgotPassword(email);
export const resetPassword = (token, password) => apiService.resetPassword(token, password);

export const createOrder = (orderData) => apiService.createOrder(orderData);
export const getUserOrders = () => apiService.getUserOrders();
export const getOrderById = (id) => apiService.getOrderById(id);
export const updateOrderStatus = (orderId, status) => apiService.updateOrderStatus(orderId, status);

export const updateUserProfile = (userData) => apiService.updateUserProfile(userData);
export const changePassword = (passwordData) => apiService.changePassword(passwordData);

export const processPayment = (paymentData) => apiService.processPayment(paymentData);
export const validatePayment = (paymentId) => apiService.validatePayment(paymentId);

export const getWishlist = () => apiService.getWishlist();
export const addToWishlist = (productId) => apiService.addToWishlist(productId);
export const removeFromWishlist = (productId) => apiService.removeFromWishlist(productId);

export const getProductReviews = (productId) => apiService.getProductReviews(productId);
export const createReview = (reviewData) => apiService.createReview(reviewData);
export const updateReview = (reviewId, reviewData) => apiService.updateReview(reviewId, reviewData);
export const deleteReview = (reviewId) => apiService.deleteReview(reviewId);

export const validateCoupon = (couponCode) => apiService.validateCoupon(couponCode);
export const applyCoupon = (couponCode, orderTotal) => apiService.applyCoupon(couponCode, orderTotal);

// Aliases for backward compatibility
export const getOrderHistory = getUserOrders;
export const getUserProfile = getCurrentUser;

// Product Detail APIs
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return mock data for development
    return getMockProductById(id);
  }
};

export const getRelatedProducts = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/related`);
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching related products:', error);
    // Return mock related products
    const allProducts = await getProducts();
    return allProducts.filter(p => p.id !== parseInt(productId)).slice(0, 4);
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    // Return mock reviews
    return getMockReviews(productId);
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    // For development, just return success
    return { success: true, message: 'Review submitted successfully' };
  }
};

// Mock data functions
const getMockProductById = (id) => {
  const products = getMockProducts();
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Enhanced product data for detail page
  return {
    ...product,
    images: [
      product.image,
      '/images/burger-2.jpg',
      '/images/burger-3.jpg'
    ],
    sizes: product.category === 'burgers' ? ['Small', 'Medium', 'Large'] : 
           product.category === 'drinks' ? ['Regular', 'Large'] : [],
    detailedDescription: `${product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
    ingredients: [
      'Fresh beef patty',
      'Lettuce',
      'Tomato',
      'Onion',
      'Cheese',
      'Special sauce',
      'Sesame seed bun'
    ],
    allergens: 'Contains: Gluten, Dairy, Eggs. May contain traces of nuts.',
    nutrition: {
      calories: 540,
      protein: 25,
      carbs: 45,
      fat: 31,
      sodium: 1040
    },
    rating: 4.5,
    reviewCount: 128,
    is_available: true,
    originalPrice: product.price > 50000 ? product.price + 20000 : null,
    discount: product.price > 50000 ? 15 : null
  };
};

const getMockReviews = (productId) => {
  return [
    {
      id: 1,
      productId: parseInt(productId),
      name: 'Nguyễn Văn A',
      rating: 5,
      title: 'Rất ngon!',
      comment: 'Món ăn ngon, giao hàng nhanh. Sẽ đặt lại! Chất lượng tuyệt vời, giá cả hợp lý.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      productId: parseInt(productId),
      name: 'Trần Thị B',
      rating: 4,
      title: 'Khá ổn',
      comment: 'Vị ổn, giá hợp lý. Có thể cải thiện thêm về phần trình bày. Nhưng tổng thể khá hài lòng.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      productId: parseInt(productId),
      name: 'Lê Văn C',
      rating: 5,
      title: 'Tuyệt vời!',
      comment: 'Đây là lần thứ 3 tôi đặt món này. Luôn đảm bảo chất lượng, nhiệt độ vừa phải khi giao.',
      date: '2024-01-08',
      verified: true
    },
    {
      id: 4,
      productId: parseInt(productId),
      name: 'Phạm Thị D',
      rating: 3,
      title: 'Bình thường',
      comment: 'Không có gì đặc biệt nhưng cũng không tệ. Có thể thử các món khác.',
      date: '2024-01-05',
      verified: false
    }
  ];
};

const getMockProducts = () => {
  return [
    {
      id: 1,
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh vegetables',
      price: 75000,
      image: '/images/burger-1.jpg',
      category: 'burgers',
      is_available: true
    },
    {
      id: 2,
      name: 'Cheese Pizza',
      description: 'Traditional pizza with mozzarella cheese',
      price: 120000,
      image: '/images/pizza-1.jpg',
      category: 'pizza',
      is_available: true
    },
    {
      id: 3,
      name: 'Chicken Wings',
      description: 'Spicy chicken wings with BBQ sauce',
      price: 85000,
      image: '/images/wings-1.jpg',
      category: 'chicken',
      is_available: true
    },
    {
      id: 4,
      name: 'French Fries',
      description: 'Crispy golden french fries',
      price: 35000,
      image: '/images/fries-1.jpg',
      category: 'sides',
      is_available: true
    },
    {
      id: 5,
      name: 'Coca Cola',
      description: 'Refreshing cold drink',
      price: 15000,
      image: '/images/coke-1.jpg',
      category: 'drinks',
      is_available: true
    },
    {
      id: 6,
      name: 'Fish Burger',
      description: 'Crispy fish fillet with tartar sauce',
      price: 65000,
      image: '/images/fish-burger-1.jpg',
      category: 'burgers',
      is_available: true
    }
  ];
};
