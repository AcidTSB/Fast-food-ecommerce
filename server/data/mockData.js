// Shared mock database

let users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ3ip4XTW.XO',
    phone: '',
    address: '',
    role: 'customer',
    created_at: new Date()
  }
];

let orders = [];

const products = [
  {
    id: 1,
    name: 'Classic Burger',
    slug: 'classic-burger',
    description: 'Burger truyền thống với thịt bò, rau xanh và sốt đặc biệt',
    price: 75000,
    image: '/images/products/burger-classic.jpg',
    category_id: 1,
    category_slug: 'burgers',
    rating: 4.5,
    rating_count: 120,
    is_featured: true,
    is_available: true,
    calories: 520
  },
  {
    id: 2,
    name: 'Cheese Burger',
    slug: 'cheese-burger',
    description: 'Burger phô mai thơm ngon với thịt bò và phô mai cheddar',
    price: 85000,
    image: '/images/products/burger-cheese.jpg',
    category_id: 1,
    category_slug: 'burgers',
    rating: 4.7,
    rating_count: 95,
    is_featured: true,
    is_available: true,
    calories: 580
  },
  {
    id: 3,
    name: 'French Fries',
    slug: 'french-fries',
    description: 'Khoai tây chiên giòn rụm, ăn kèm với sốt',
    price: 35000,
    image: '/images/products/fries-regular.jpg',
    category_id: 2,
    category_slug: 'sides',
    rating: 4.3,
    rating_count: 80,
    is_featured: false,
    is_available: true,
    calories: 300
  }
];

const categories = [
  {
    id: 1,
    name: 'Burgers',
    slug: 'burgers',
    description: 'Các loại burger thơm ngon',
    image: '/images/categories/burgers.jpg',
    is_active: true,
    sort_order: 1
  },
  {
    id: 2,
    name: 'Sides',
    slug: 'sides',
    description: 'Món ăn kèm',
    image: '/images/categories/sides.jpg',
    is_active: true,
    sort_order: 2
  }
];

// Export functions để share data
module.exports = {
  // Users
  getUsers: () => users,
  addUser: (user) => {
    users.push(user);
    return user;
  },
  findUser: (predicate) => users.find(predicate),
  updateUser: (userId, updates) => {
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },

  // Orders
  getOrders: () => orders,
  addOrder: (order) => {
    orders.push(order);
    return order;
  },
  findOrder: (predicate) => orders.find(predicate),
  getUserOrders: (userId) => orders.filter(o => o.user_id === userId),
  updateOrder: (orderId, updates) => {
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      return orders[index];
    }
    return null;
  },

  // Products & Categories
  getProducts: () => products,
  getCategories: () => categories,
  
  // Get next IDs
  getNextUserId: () => Math.max(...users.map(u => u.id), 0) + 1,
  getNextOrderId: () => Math.max(...orders.map(o => o.id), 0) + 1
};