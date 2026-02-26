import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import './ProductDetail.css';
import { useTheme } from '../context/ThemeContext';
import { getProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
        const currentProduct = await getProductById(id);  
        
        if (!currentProduct) {
          throw new Error('Product not found');
        }

        setProduct(currentProduct)
        
        // Set default size if available
        if (currentProduct.sizes && currentProduct.sizes.length > 0) {
          setSelectedSize(currentProduct.sizes[0]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id]);

  // Thêm useEffect này để lấy suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}/suggestions`);
        const json = await res.json();
        if (json.success) {
          setSuggestions(json.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý combo:', error);
      }
    };
    if (id) fetchSuggestions();
  }, [id]);

  // useEffect để lấy sản phẩm liên quan
useEffect(() => {
  const fetchRelatedProducts = async () => {
    if (!product || !product.id) return;
    const url = `http://localhost:5000/api/products?exclude_id=${product.id}&limit=4`;

    console.log('📦 Fetching related products:', url);

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setRelatedProducts(json.data);
      }
    } catch (error) {
      setRelatedProducts([]);
    }
  };
  fetchRelatedProducts();
}, [product]);


  useEffect(() => {
    console.log('relatedProducts:', relatedProducts);
  }, [relatedProducts]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    
    try {
      const cartItem = {
        ...product,
        quantity,
        selectedSize,
        totalPrice: product.price * quantity
      };

      await addToCart(cartItem);
      
      // Show success feedback
      alert('Đã thêm vào giỏ hàng!');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      history.push('/checkout');
    }, 500);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <LoadingSpinner text="Đang tải sản phẩm..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Không tìm thấy sản phẩm</h2>
            <p>{error}</p>
            <button onClick={() => history.goBack()}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-detail-page ${isDark ? 'dark' : ''}`}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => history.goBack()} className="back-btn">
            ← Quay lại
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Main Product Info */}
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < Math.floor(product.rating || 4.5) ? 'filled' : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating || 4.5} ({product.reviewCount || 89} đánh giá)
                </span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">
                {product.price?.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h4>Chọn size:</h4>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h4>Số lượng:</h4>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.is_available}
                className="add-to-cart-btn"
              >
                {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={!product.is_available}
                className="buy-now-btn"
              >
                Mua ngay
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>Giao hàng miễn phí đơn từ 200k</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>Đổi trả trong vòng 24h</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>Cam kết chất lượng 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-headers">
            <button 
              onClick={() => setActiveTab('description')}
              className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
            >
              Mô tả chi tiết
            </button>
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`tab-header ${activeTab === 'nutrition' ? 'active' : ''}`}
            >
              Thông tin dinh dưỡng
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-tab">
                <h3>Mô tả sản phẩm</h3>
                <div className="detailed-description">
                  <p>{product.detailedDescription || product.description}</p>
                  
                  {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
                    <div className="ingredients">
                      <h4>Thành phần:</h4>
                      <ul>
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.allergens && (
                    <div className="allergens">
                      <h4>Cảnh báo dị ứng:</h4>
                      <p>{product.allergens}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="nutrition-tab">
                <h3>Thông tin dinh dưỡng</h3>
                <div className="nutrition-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Thành phần</th>
                        <th>Giá trị (per 100g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Calories</td>
                        <td>{product.nutrition?.calories || '250 kcal'}kcal</td>
                      </tr>
                      <tr>
                        <td>Protein</td>
                        <td>{product.nutrition?.protein || '15g'}  </td>
                      </tr>
                      <tr>
                        <td>Carbs</td>
                        <td>{product.nutrition?.carbohydrate || '30g'}</td>
                      </tr>
                      <tr>
                        <td>Fat</td>
                        <td>{product.nutrition?.fat || '12g'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="combo-suggestions">
            <h2 className="text-2xl font-semibold mt-12 mb-4">Món ăn thường đi kèm</h2>
            <div className="suggestion-grid">
              {suggestions.map(item => (
                <div key={item.product_id} className="suggestion-card">
                  <img src={item.image} alt={item.name} className="suggestion-image" />
                  <p className="suggestion-name">{item.name}</p>
                  <p className="suggestion-price">{item.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length >= 0 && (
          <div className="related-products">
            <h2>Sản phẩm liên quan</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;