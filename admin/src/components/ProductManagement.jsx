import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './products/ProductCard';

const ProductManagement = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    image: '',
    category_id: '',
    is_featured: false,
    is_available: true
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate và format dữ liệu trước khi gửi
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      category_id: parseInt(formData.category_id) || null
    };

    console.log('📤 Submitting data:', dataToSubmit);
    
    const success = editingProduct
      ? await updateProduct(editingProduct.id, dataToSubmit)
      : await createProduct(dataToSubmit);
    
    if (success) {
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      sale_price: '',
      image: '',
      category_id: '',
      is_featured: false,
      is_available: true
    });
  };

  const handleEdit = (product) => {
    console.log('🔧 Editing product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      sale_price: product.sale_price ? product.sale_price.toString() : '',
      image: product.image || '',
      category_id: product.category_id ? product.category_id.toString() : '',
      is_featured: Boolean(product.is_featured),
      is_available: Boolean(product.is_available)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      await deleteProduct(id);
    }
  };

  const handleToggleFeatured = async (id) => {
    await toggleFeatured(id);
  };

  // Safe rendering với error boundaries
  const renderProducts = () => {
    if (!Array.isArray(products)) {
      return <div className="error">Không có dữ liệu sản phẩm</div>;
    }

    if (products.length === 0) {
      return <div className="empty-state">Chưa có sản phẩm nào</div>;
    }

    return products.map(product => {
      // Validate product data
      if (!product || !product.id) {
        console.warn('Invalid product data:', product);
        return null;
      }

      return (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
        />
      );
    }).filter(Boolean); // Remove null items
  };

  return (
    <div className="product-management">
      <div className="header">
        <h2>Quản lý sản phẩm</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Thêm sản phẩm mới
        </button>
      </div>

      {loading && <div className="loading">Đang tải...</div>}
      
      {error && (
        <div className="error">
          Lỗi: {error}
          <button onClick={() => fetchProducts()}>Thử lại</button>
        </div>
      )}

      <div className="products-grid">
        {renderProducts()}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="form-body">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Giá *</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Giá khuyến mãi</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.sale_price}
                      onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>URL hình ảnh</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">Burger & Sandwich</option>
                    <option value="2">Pizza</option>
                    <option value="3">Đồ uống</option>
                    <option value="4">Combo</option>
                    <option value="5">Món ăn phụ</option>
                  </select>
                </div>
                
                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    Sản phẩm nổi bật
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                    />
                    Có sẵn
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;