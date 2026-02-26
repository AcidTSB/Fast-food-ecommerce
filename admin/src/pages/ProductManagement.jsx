import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import Layout from '../components/layout/Layout';
import './ProductManagement.css';

const ProductManagement = () => {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = (product) => {
    addProduct(product);
    setShowForm(false);
  };

  const handleEditProduct = (product) => {
    updateProduct(product);
    setSelectedProduct(null);
    setShowForm(false);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
      setShowConfirmModal(false);
    }
  };

  return (
    <Layout>
      <div className="products-page">
        <h1 className="page-title">Quản lý Sản phẩm</h1>
        
        <div className="product-content">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ProductList
              products={products}
              onEdit={setSelectedProduct}
              onDelete={(product) => {
                setProductToDelete(product);
                setShowConfirmModal(true);
              }}
            />
          )}

          {showForm && (
            <ProductForm
              product={selectedProduct}
              onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => setShowForm(false)}
            />
          )}

          {showConfirmModal && (
            <ConfirmModal
              message={`Are you sure you want to delete ${productToDelete?.name}?`}
              onConfirm={handleDeleteProduct}
              onCancel={() => setShowConfirmModal(false)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductManagement;