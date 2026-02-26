import React, { useEffect, useState } from 'react';
import { getTopProducts } from '../../services/productService';
import './TopProducts.css';

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const products = await getTopProducts();
        setTopProducts(products);
      } catch (err) {
        setError('Failed to fetch top products');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="top-products">
      <h2 className="section-title">Top Products</h2>
      <div className="products-list">
        {topProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>${product.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;