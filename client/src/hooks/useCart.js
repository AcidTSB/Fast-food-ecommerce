import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const useCart = () => {
    const { cart, setCart } = useContext(CartContext);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const calculateTotals = () => {
            const amount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const items = cart.reduce((acc, item) => acc + item.quantity, 0);
            setTotalAmount(amount);
            setTotalItems(items);
        };

        calculateTotals();
    }, [cart]);

    const addToCart = (product) => {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            setCart(cart.map(item => 
                item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            setCart(cart.map(item => 
                item.id === id ? { ...item, quantity } : item
            ));
        }
    };

    return {
        cart,
        totalAmount,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
    };
};

export default useCart;