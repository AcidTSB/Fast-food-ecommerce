import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useHistory } from 'react-router-dom';

const ProductForm = ({ productId }) => {
  const { getProduct, addProduct, updateProduct } = useProducts();
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    allergens: '',
    nutrition: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const product = await getProduct(productId);
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || '',
          image: product.image || '',
          allergens: product.allergens
            ? (typeof product.allergens === 'string'
                ? product.allergens
                : JSON.stringify(product.allergens))
            : '',
          nutrition: product.nutrition
            ? (typeof product.nutrition === 'string'
                ? product.nutrition
                : JSON.stringify(product.nutrition))
            : '',
        });
      };
      fetchProduct();
    }
  }, [productId, getProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (productId) {
        await updateProduct(productId, {
          ...formData,
          description: formData.description,
          allergens: formData.allergens,
          nutrition: formData.nutrition,
        });
      } else {
        await addProduct({
          ...formData,
          description: formData.description,
          allergens: formData.allergens,
          nutrition: formData.nutrition,
        });
      }
      history.push('/admin/products');
    } catch (err) {
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>{productId ? 'Edit Product' : 'Add Product'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-input"
            rows={3}
            placeholder="Nhập mô tả chi tiết sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Giá sản phẩm</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Nhập giá sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Danh mục</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Nhập danh mục sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>URL hình ảnh</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            placeholder="Nhập URL hình ảnh sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Dị ứng (Allergy Info)</label>
          <input
            type="text"
            name="allergens"
            value={formData.allergens}
            onChange={handleChange}
            className="form-input"
            placeholder='Ví dụ: "Trứng, sữa, gluten"'
          />
        </div>
        <div className="form-group">
          <label>Thông tin dinh dưỡng (Nutrition)</label>
          <input
            type="text"
            name="nutrition"
            value={formData.nutrition}
            onChange={handleChange}
            className="form-input"
            placeholder='Ví dụ: {"fat":"28g","protein":"35g","calories":650,"carbohydrate":"45g"}'
          />
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;