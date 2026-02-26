const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// Middleware tùy chọn authentication (có thể dùng session cho guest)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticateToken(req, res, next);
  }
  next();
};

// Routes
router.post('/add', optionalAuth, addToCart);
router.get('/', optionalAuth, getCart);
router.put('/items/:id', optionalAuth, updateCartItem);
router.delete('/items/:id', optionalAuth, removeFromCart);
router.delete('/clear', optionalAuth, clearCart);

module.exports = router;