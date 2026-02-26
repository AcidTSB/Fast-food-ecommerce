const express = require('express');
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleFeatured,
  getProductsByCategory
} = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');
const { getProductSuggestions } = require('../controllers/productController');



const router = express.Router();

// Public routes
router.get('/:id/suggestions', getProductSuggestions);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Admin only routes
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
router.patch('/:id/featured', adminAuth, toggleFeatured);

module.exports = router;