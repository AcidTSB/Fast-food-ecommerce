import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart, formatPrice } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={item.image || '/images/placeholder-food.jpg'} 
          alt={item.name}
          onError={(e) => {
            e.target.src = '/images/placeholder-food.jpg';
          }}
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <div className="cart-item-price">
          <span className="unit-price">
            Đơn giá: {formatPrice(item.price)}
          </span>
        </div>
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn minus"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label="Giảm số lượng"
        >
          -
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          className="quantity-btn plus"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        <span className="total-price">
          {formatPrice(itemTotal)}
        </span>
      </div>
      
      <button 
        className="remove-item-btn"
        onClick={() => removeFromCart(item.id)}
        aria-label="Xóa sản phẩm"
        title="Xóa khỏi giỏ hàng"
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;