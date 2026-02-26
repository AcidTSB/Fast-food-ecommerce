import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async (limit = 8) => {
    try {
      setLoading(true);
      const response = await apiService.getFeaturedProducts(limit);
      setFeaturedProducts(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products with filters
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getProducts(filters);
      setProducts(response.data);
      return response;
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
      return { data: [], pagination: { total: 0 } };
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      setLoading(true);
      const response = await apiService.getProductById(id);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Error fetching product:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query, filters = {}) => {
    try {
      setLoading(true);
      const response = await apiService.searchProducts(query, filters);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Error searching products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  const value = {
    products,
    featuredProducts,
    categories,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    getProduct,
    searchProducts,
    fetchCategories
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};