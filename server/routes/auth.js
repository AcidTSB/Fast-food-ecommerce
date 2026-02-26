const express = require('express');
const { adminLogin, userLogin, verifyToken, register } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Login routes
router.post('/admin/login', adminLogin);
router.post('/login', userLogin);

// Register route
router.post('/register', register);

// Verify token
router.get('/verify', auth, verifyToken);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;