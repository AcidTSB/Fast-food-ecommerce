import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Import từ .jsx
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Đúng function name
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔥 Add to Cart clicked for:', product?.name);

    if (!product) {
      console.error('No product data');
      return;
    }

    setIsAdding(true);
    
    try {
      console.log('Calling addToCart with:', product);
      
      // Call addToCart - CartContext.jsx version
      addToCart(product, 1);
      
      console.log('addToCart completed successfully');
      
    } catch (error) {
      console.error('Error in addToCart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!product) {
    return <div>Invalid product</div>;
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.image || '/images/placeholder-food.jpg'} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/placeholder-food.jpg';
            }}
          />
          {product.is_featured && (
            <div className="product-badge featured">Nổi bật</div>
          )}
          {product.discount_percent > 0 && (
            <div className="product-badge sale">-{product.discount_percent}%</div>
          )}
        </div>
        
        <div className="product-info">
          <div className="product-content">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
          </div>
          
          <div className="product-details">
            <div className="product-pricing">
              <span className="product-price">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="product-original-price">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            {product.calories && (
              <span className="product-calories">{product.calories} cal</span>
            )}
          </div>
        </div>
      </Link>
      
      <button 
        type="button"
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={isAdding || !product.is_available}
      >
        {isAdding ? '✅ Đã thêm!' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
};

export default ProductCard;