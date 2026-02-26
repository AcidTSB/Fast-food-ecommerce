// This file contains utility functions used in the server. 

const generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, length + 2);
};

const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports = {
    generateRandomString,
    formatCurrency,
    calculateDiscountedPrice,
    isValidEmail,
};