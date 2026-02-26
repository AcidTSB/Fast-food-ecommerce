import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete, onToggleFeatured, isUpdating = false }) => {
  // Validate product data
  if (!product) {
    return <div className="product-card error">Product data not available</div>;
  }

  console.log('🔍 ProductCard rendering:', {
    id: product.id,
    name: product.name,
    isUpdating
  });

  // Safe formatting functions
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0';
    }
    return Number(price).toLocaleString();
  };

  const formatCurrency = (price) => {
    return `${formatPrice(price)} VNĐ`;
  };

  const isAvailable = product.is_available !== false;
  const isFeatured = product.is_featured === true;
  
  const displayPrice = product.sale_price && product.sale_price > 0 
    ? product.sale_price 
    : product.price;
  
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <div className={`product-card ${!isAvailable ? 'unavailable' : ''} ${isUpdating ? 'updating' : ''}`}>
      {/* Overlay khi đang update */}
      {isUpdating && (
        <div className="updating-overlay">
          <div className="spinner">⏳</div>
          <span>Đang cập nhật...</span>
        </div>
      )}
      
      <div className="product-image-container">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name || 'Product'} 
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        ) : (
          <div className="placeholder-image">
            <span>No Image</span>
          </div>
        )}
        
        {isFeatured && (
          <span className="featured-badge">Nổi bật</span>
        )}
        
        <div className={`product-status ${isAvailable ? 'status-active' : 'status-inactive'}`}>
          {isAvailable ? 'Có sẵn' : 'Hết hàng'}
        </div>
        
        {hasDiscount && (
          <div className="product-badge discount-badge">
            Giảm giá
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">
          {product.category_name || 'Chưa phân loại'}
        </div>
        
        <h3 className="product-title">{product.name || 'Unnamed Product'}</h3>
        
        <div className="product-prices">
          {hasDiscount ? (
            <>
              <span className="current-price sale">
                {formatCurrency(product.sale_price)}
              </span>
              <span className="original-price">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="current-price">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <div className="product-meta">
          <span>ID: <span className="product-id">{product.id || 'N/A'}</span></span>
          <span>Danh mục: {product.category_name || 'N/A'}</span>
        </div>
      </div>

      <div className="product-actions">
        <button 
          className="product-action action-edit" 
          onClick={() => onEdit && onEdit(product)}
          disabled={isUpdating}
        >
          <span className="action-icon">✏️</span> Sửa
        </button>
        
        <button 
          className={`product-action action-featured ${isFeatured ? 'featured' : ''}`}
          onClick={() => onToggleFeatured && onToggleFeatured(product.id)}
          disabled={isUpdating}
        >
          <span className="action-icon">{isFeatured ? '⭐' : '☆'}</span>
          {isFeatured ? 'Nổi bật' : 'Làm nổi bật'}
        </button>
        
        <button
          className="product-action action-delete"
          onClick={() => onDelete && onDelete(product.id)} // Đúng: truyền product.id
          disabled={isUpdating}
        >
          <span className="action-icon">🗑️</span> Xóa
        </button>
      </div>
    </div>
  );
};

export default ProductCard;