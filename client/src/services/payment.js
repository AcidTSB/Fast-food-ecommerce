import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your backend API URL

export const initiatePayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/payments/initiate`, paymentData);
        return response.data;
    } catch (error) {
        throw new Error('Payment initiation failed: ' + error.message);
    }
};

export const confirmPayment = async (paymentId) => {
    try {
        const response = await axios.post(`${API_URL}/payments/confirm`, { paymentId });
        return response.data;
    } catch (error) {
        throw new Error('Payment confirmation failed: ' + error.message);
    }
};

export const getPaymentStatus = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/payments/status/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to retrieve payment status: ' + error.message);
    }
};