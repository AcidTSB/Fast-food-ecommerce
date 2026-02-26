import React, { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductList = ({ products: propProducts, category = '', searchTerm = '' }) => {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(!propProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if products weren't passed as props
    if (propProducts) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts(category, searchTerm);
        setProducts(response.data || response);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm, propProducts]);

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map(product => {
            // Validate product data before passing to ProductCard
            if (!product || !product.id) {
              console.error('Invalid product in list:', product);
              return null;
            }
            
            console.log('Rendering product:', product);
            
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;