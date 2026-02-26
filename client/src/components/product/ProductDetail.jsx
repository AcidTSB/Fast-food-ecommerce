import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/products/${id}/suggestions`);
        const json = await res.json();
        if (json.success) {
          setSuggestions(json.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy gợi ý combo:', error);
      }
    };

    if (product?.id) {
      fetchSuggestions();
    }
  }, [id, product]);

  if (!product) return <div>Đang tải sản phẩm...</div>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p className="price">Giá: {product.price.toLocaleString()}₫</p>

      {suggestions.length > 0 && (
        <div className="combo-suggestions">
          <h3>Món ăn thường đi kèm</h3>
          <div className="suggestion-list">
            {suggestions.map(item => (
              <div key={item.product_id} className="suggestion-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.price.toLocaleString()}₫</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
