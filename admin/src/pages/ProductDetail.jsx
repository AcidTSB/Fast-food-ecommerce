import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getProductById } from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="Đang tải thông tin sản phẩm..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <h2>Lỗi khi tải sản phẩm</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => history.push('/products')}
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Chi tiết sản phẩm</h1>
        <button 
          className="btn btn-primary"
          onClick={() => history.push('/products')}
        >
          Quay lại danh sách sản phẩm
        </button>
      </div>

      {product ? (
        <div className="product-detail-container">
          <div className="product-image-gallery">
            <img 
              src={product.image || 'https://via.placeholder.com/400'} 
              alt={product.name} 
              className="product-main-image"
            />
          </div>
          
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-category">{product.category}</p>
            <div className="product-price-info">
              <span className="product-price">{product.price?.toLocaleString('vi-VN')}đ</span>
              {product.discountPrice && (
                <span className="product-discount-price">{product.discountPrice?.toLocaleString('vi-VN')}đ</span>
              )}
            </div>
            
            <div className="product-description">
              <h3>Mô tả</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">SKU:</span>
                <span className="meta-value">{product.sku || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tồn kho:</span>
                <span className="meta-value">{product.stock || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trạng thái:</span>
                <span className={`meta-value status-${product.status?.toLowerCase() || 'inactive'}`}>
                  {product.status || 'Ngừng bán'}
                </span>
              </div>
            </div>
            
            <div className="product-actions">
              <button 
                className="btn btn-primary"
                onClick={() => history.push(`/products/edit/${product.id}`)}
              >
                Chỉnh sửa sản phẩm
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="not-found">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetail;