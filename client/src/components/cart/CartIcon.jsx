import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

const CartIcon = () => {
  const { items, totalItems, isOpen, toggleCart } = useCart();
  
  console.log('🛒 CartIcon render:', { 
    itemsCount: items?.length || 0, 
    totalItems,
    isOpen 
  });

  return (
    <div 
      className="cart-icon"
      onClick={toggleCart}
    >
      <div className="cart-icon-wrapper">
        <span className="cart-emoji">🛒</span>
        <span className="cart-text">Giỏ hàng</span>
        
        {totalItems > 0 && (
          <span className="cart-badge">
            {totalItems}
          </span>
        )}
      </div>
      
      {totalItems > 0 && (
        <div className="cart-tooltip">
          {totalItems} món trong giỏ hàng
        </div>
      )}
    </div>
  );
};

export default CartIcon;