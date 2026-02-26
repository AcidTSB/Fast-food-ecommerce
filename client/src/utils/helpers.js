const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
};

const getCurrentDate = () => {
    return new Date().toLocaleDateString();
};

const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

export { formatCurrency, calculateDiscountedPrice, getCurrentDate, isValidEmail, debounce };