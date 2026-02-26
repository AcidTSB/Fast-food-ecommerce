const express = require('express');
const { 
  getCategories, 
  getCategoryBySlug, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin only routes
router.post('/', adminAuth, createCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

module.exports = router;