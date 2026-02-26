import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ProductModal.css';

// Đảm bảo Modal được cấu hình đúng cho accessibility
Modal.setAppElement('#root');

const ProductModal = ({ isOpen, onRequestClose, product, onSave, isSubmitting, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    status: 'active',
    discount: 0,
    allergens: '',        // thêm
    nutrition: '',      // thêm
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  // Cập nhật form khi product thay đổi
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        category: typeof product.category === 'object' && product.category !== null 
          ? product.category.id 
          : product.category || '',
        image: product.image || '',
        status: product.status || 'active',
        discount: product.discount || 0,
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
      setImagePreview(product.image || '');
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      image: '',
      status: 'active',
      discount: 0,
      allergens: '',        // thêm
      nutrition: '',      // thêm
    });
    setImagePreview('');
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));
    if (name === 'image') setImagePreview(value);
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadForm,
        });
        const data = await res.json();
        if (data.success) {
          setFormData(prev => ({ ...prev, image: data.url })); // Dùng callback để giữ nguyên các trường khác
          setImagePreview(data.url);
        } else {
          alert('Tải ảnh lên thất bại');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Đã xảy ra lỗi khi tải ảnh lên');
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !String(formData.name).trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    // Kiểm tra category là rỗng, null hoặc ""
    if (!formData.category) {
      newErrors.category = 'Danh mục không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cập nhật hàm handleSubmit để xử lý đúng giá trị category
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount || 0),
        category_id: formData.category, // Gửi id
      };
      delete productData.category; // Xóa trường category nếu không cần
      onSave(productData);
    }
  };

  const handleClose = () => {
    resetForm();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="product-modal"
      overlayClassName="product-modal-overlay"
      contentLabel={product ? "Sửa Sản phẩm" : "Thêm Sản phẩm"}
    >
      <div className="modal-header">
        <h2>{product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h2>
        <button className="modal-close" onClick={handleClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-columns">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm <span className="required">*</span></label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Giá <span className="required">*</span></label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="discount">Giảm giá (%)</label>
                <input
                  id="discount"
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Danh mục <span className="required">*</span></label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </select>
            </div>
          </div>
          
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">URL Hình ảnh</label>
              <input
                id="image"
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Dán URL hình ảnh hoặc chọn file bên dưới"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageFile">Hoặc tải ảnh từ máy</label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="image-preview">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x120?text=Lỗi+hình+ảnh';
                  }}
                />
              ) : (
                <div className="no-image">Không có hình ảnh</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="allergens">Dị ứng (Allergy Info)</label>
              <input
                id="allergens"
                type="text"
                name="allergens"
                value={formData.allergens}
                onChange={handleChange}
                placeholder='Ví dụ: "Trứng, sữa, gluten"'
              />
            </div>
            <div className="form-group">
              <label htmlFor="nutrition">Thông tin dinh dưỡng (Nutrition):<br/>
                <code>{'{ "fat": "28g", "protein": "10g", "calories": "250kcal" }'}</code>
              </label>
              <input
                id="nutrition"
                type="text"
                name="nutrition"
                value={formData.nutrition}
                onChange={handleChange}
                placeholder='Ví dụ: {"fat":"28g","protein":"35g","calories":650,"carbohydrate":"45g"}'
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Hủy
          </button>
          <button type="submit" className="btn-save" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;