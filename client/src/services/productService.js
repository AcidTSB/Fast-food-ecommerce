import axios from 'axios';
import { API_URL } from '../config';

const API = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public APIs
export const getProducts = async (filters = {}) => {
  try {
    const response = await API.get('/api/products', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Admin APIs
export const createProduct = async (productData) => {
  try {
    const response = await API.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const toggleProductFeatured = async (id) => {
  try {
    const response = await API.patch(`/api/products/${id}/featured`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};