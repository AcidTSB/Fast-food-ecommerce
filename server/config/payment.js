const paymentConfig = {
    provider: process.env.PAYMENT_PROVIDER || 'momo', // Default payment provider
    apiKey: process.env.PAYMENT_API_KEY || '', // API key for payment provider
    secretKey: process.env.PAYMENT_SECRET_KEY || '', // Secret key for payment provider
    returnUrl: process.env.PAYMENT_RETURN_URL || 'http://localhost:5000/api/payments/return', // URL to return after payment
    currency: 'VND', // Currency for transactions
    timeout: 30000, // Timeout for payment requests in milliseconds
};

module.exports = paymentConfig;