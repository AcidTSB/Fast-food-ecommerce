import axios from 'axios';
import { API_URL } from '../config';

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xem đơn hàng của người dùng
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xem chi tiết một đơn hàng
export const getOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Huỷ đơn hàng
export const cancelOrder = async (orderId) => {
  // Gọi API backend để huỷ đơn hàng
  const response = await axios.post(`${API_URL}/orders/${orderId}/cancel`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};