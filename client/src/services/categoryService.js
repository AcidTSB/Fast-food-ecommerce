import axios from 'axios';
import { API_URL } from '../config';

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};