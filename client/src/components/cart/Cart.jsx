import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Cart = () => {
  const { 
    items, 
    totalItems, 
    isOpen, 
    closeCart, 
    clearCart,
    getFormattedTotal,
    getFormattedSubtotal
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Giỏ Hàng Của Bạn</h2>
          <button className="close-cart-btn" onClick={closeCart}>
            ×
          </button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>🛒 Giỏ hàng trống</p>
              <p>Hãy thêm một số món ăn ngon!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <CartItem key={`${item.id}-${JSON.stringify(item.variants)}`} item={item} />
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Tạm tính ({totalItems} món):</span>
                  <span className="summary-price">{getFormattedSubtotal()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Phí giao hàng:</span>
                  <span className="summary-price">30.000₫</span>
                </div>
                
                <div className="summary-row">
                  <span>VAT (10%):</span>
                  <span className="summary-price">
                    {/* Tính 10% VAT */}
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1)}
                  </span>
                </div>
                
                <div className="summary-total">
                  <span>Tổng cộng:</span>
                  <span className="total-price">
                    {/* Tổng = tạm tính + phí ship + VAT */}
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(
                      items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1 + 30000
                    )}
                  </span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="btn btn-outline btn-full"
                  onClick={clearCart}
                >
                  Xóa Tất Cả
                </button>
                <button 
                  className="btn btn-primary btn-full"
                  onClick={() => {
                    closeCart();
                    // Navigate to checkout
                    window.location.href = '/checkout';
                  }}
                >
                  Tiến Hành Thanh Toán
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;