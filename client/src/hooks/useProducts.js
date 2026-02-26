import { useState, useCallback } from 'react';
import * as productService from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data || []);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.createProduct(productData);
      setProducts(prev => [response.data, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.updateProduct(id, productData);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? response.data : product
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.toggleProductFeatured(id);
      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, is_featured: response.data.is_featured }
            : product
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured
  };
};