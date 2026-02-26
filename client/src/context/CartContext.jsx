import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

// Helper function để format tiền VND
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function để đảm bảo price là số VND
const ensureVNDPrice = (price) => {
  if (typeof price === 'string') {
    // Remove all non-numeric characters except decimal point
    const cleaned = price.replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return typeof price === 'number' ? price : 0;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, variants = [] } = action.payload;
      
      // Đảm bảo price là VND number
      const vndPrice = ensureVNDPrice(product.price);
      
      console.log('🛒 Adding item to cart:', {
        product: product.name,
        originalPrice: product.price,
        vndPrice: vndPrice,
        formatted: formatVND(vndPrice)
      });
      
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && 
        JSON.stringify(item.variants) === JSON.stringify(variants)
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + quantity,
          totalPrice: state.totalPrice + (vndPrice * quantity)
        };
      } else {
        // Add new item với giá VND
        const newItem = {
          id: product.id,
          name: product.name,
          price: vndPrice, // Lưu giá VND dạng số
          image: product.image || product.image_url,
          quantity,
          variants,
          productData: product
        };

        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + quantity,
          totalPrice: state.totalPrice + (vndPrice * quantity)
        };
      }
    }

    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) return state;

      const item = state.items[itemIndex];
      const quantityDiff = quantity - item.quantity;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const updatedItems = [...state.items];
      updatedItems[itemIndex].quantity = quantity;

      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (item.price * quantityDiff)
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    case 'LOAD_CART': {
      // Đảm bảo items từ localStorage có giá VND đúng
      const loadedItems = action.payload.items?.map(item => ({
        ...item,
        price: ensureVNDPrice(item.price)
      })) || [];
      
      // Tính lại totals
      const totalItems = loadedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = loadedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: loadedItems,
        totalItems,
        totalPrice
      };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fastfood_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        console.log('📦 Loading cart from localStorage:', cartData);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice
    };
    
    localStorage.setItem('fastfood_cart', JSON.stringify(cartData));
    
    console.log('💾 Saving cart to localStorage:', {
      items: state.items.length,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      formattedTotal: formatVND(state.totalPrice)
    });
  }, [state.items, state.totalItems, state.totalPrice]);

  const addToCart = (product, quantity = 1, variants = []) => {
    console.log('🔄 Adding to cart:', {
      product: product.name,
      price: product.price,
      quantity
    });
    
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, quantity, variants }
    });
    
    // Auto open cart after adding item
    dispatch({ type: 'OPEN_CART' });
    
    // Show success notification
    showNotification(`${product.name} đã thêm vào giỏ hàng!`, 'success');
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    showNotification('Đã xóa toàn bộ giỏ hàng', 'info');
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Simple notification function
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-family: inherit;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Helper functions để format giá tiền
  const formatPrice = (amount) => formatVND(amount);
  const getFormattedTotal = () => formatVND(state.totalPrice);
  const getFormattedSubtotal = () => formatVND(state.totalPrice);

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    formatPrice,
    getFormattedTotal,
    getFormattedSubtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };