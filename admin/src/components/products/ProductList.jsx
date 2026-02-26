import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import api from '../../services/api';
import { toggleProductFeatured } from '../../services/productService';
import './ProductList.css';

const ProductList = () => {
  // Đảm bảo khởi tạo products là một mảng
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const productsPerPage = 12;

  // Tải danh sách sản phẩm
  useEffect(() => {
    fetchProducts();
  }, []);

  // Lọc sản phẩm dựa trên filters
  useEffect(() => {
    if (!Array.isArray(products)) {
      console.warn('Products không phải là một mảng trong filterProducts:', products);
      setFilteredProducts([]);
      return;
    }
    
    filterProducts();
  }, [products, filters]);

  // useEffect để gọi API categories trực tiếp
  useEffect(() => {
    const fetchCategoriesDirectly = async () => {
      try {
        console.log('Đang gọi API categories trực tiếp...');
        const response = await fetch('http://localhost:5000/api/categories');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Dữ liệu categories trực tiếp:', data);
          
          // Xác định đúng cấu trúc dữ liệu và set categories
          if (Array.isArray(data)) {
            setCategories(data);
          } else if (data && Array.isArray(data.data)) {
            setCategories(data.data);
          } else {
            console.warn('Dữ liệu không đúng định dạng mảng:', data);
            setCategories(['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad']);
          }
        } else {
          throw new Error(`API trả về lỗi: ${response.status}`);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API trực tiếp:', error);
        setCategories(['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad']);
      }
    };
    
    fetchCategoriesDirectly();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      try {
        // Thử gọi API thật
        const response = await api.fetchProducts();
        console.log('API response:', response);
        
        let productList = [];
        
        // Xử lý response để lấy danh sách sản phẩm
        if (Array.isArray(response)) {
          productList = response;
        } else if (response && Array.isArray(response.data)) {
          productList = response.data;
        } else if (response && typeof response === 'object') {
          console.warn('API trả về dữ liệu không phải mảng:', response);
          const productsArray = Object.values(response);
          if (Array.isArray(productsArray) && productsArray.length > 0 && productsArray[0].id) {
            productList = productsArray;
          } else {
            productList = getSampleProducts();
          }
        } else {
          console.warn('API không trả về mảng sản phẩm:', response);
          productList = getSampleProducts();
        }
        
        // Đảm bảo mỗi sản phẩm có thuộc tính category đúng format
        const processedProducts = productList.map(product => {
          console.log('Processing product:', product.name, 'Category:', product.category, 'Category ID:', product.category_id);
          
          // Trường hợp 1: product có category_id và name nhưng không có object category
          if (product.category_id && !product.category) {
            // Tìm category name từ API categories nếu có
            const categoryName = categories.find(c => c.id === product.category_id)?.name || 
                                getCategoryNameById(product.category_id);
            return {
              ...product,
              category: {
                id: product.category_id,
                name: categoryName
              }
            };
          }
          
          // Trường hợp 2: category là chuỗi
          if (typeof product.category === 'string') {
            return {
              ...product,
              category: {
                name: product.category,
                id: product.category_id || Math.random().toString()
              }
            };
          }
          
          // Trường hợp 3: category đã là object nhưng thiếu thông tin
          if (product.category && typeof product.category === 'object') {
            if (!product.category.name && product.category_id) {
              const categoryName = getCategoryNameById(product.category_id);
              return {
                ...product,
                category: {
                  ...product.category,
                  id: product.category_id,
                  name: categoryName
                }
              };
            }
          }
          
          // Trường hợp 4: không có category
          if (!product.category) {
            return {
              ...product,
              category: { 
                id: product.category_id || 'uncategorized', 
                name: getCategoryNameById(product.category_id) || 'Không phân loại' 
              }
            };
          }
          
          return product;
        });
        
        console.log('Processed products:', processedProducts.map(p => ({
          name: p.name, 
          category: p.category
        })));
        
        setProducts(processedProducts);
      } catch (apiError) {
        console.warn('Không thể kết nối đến API, sử dụng dữ liệu mẫu:', apiError);
        setProducts(getSampleProducts());
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  // Lọc sản phẩm dựa trên filters
  const filterProducts = () => {
    if (!Array.isArray(products)) {
      console.error('Products không phải là mảng trong filterProducts:', products);
      setFilteredProducts([]);
      return;
    }
    
    let result = [...products];
    console.log('Filtering products - initial count:', result.length);
    
    // Lọc theo từ khóa tìm kiếm
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description?.toLowerCase().includes(searchLower)
      );
      console.log('After search filter:', result.length);
    }
    
    // Lọc theo danh mục
    if (filters.category) {
      console.log('Filtering by category:', filters.category);
      
      result = result.filter(product => {
        // Xác định tên category từ nhiều định dạng khác nhau
        let categoryName;
        
        if (product.category) {
          if (typeof product.category === 'object') {
            categoryName = product.category.name;
          } else {
            categoryName = product.category;
          }
        } else if (product.category_id) {
          categoryName = getCategoryNameById(product.category_id);
        } else {
          categoryName = 'Không phân loại';
        }
        
        const match = categoryName?.toLowerCase() === filters.category.toLowerCase();
        
        console.log(`Product: ${product.name}, Category: ${categoryName}, Match: ${match}`);
        
        return match;
      });
      
      console.log('After category filter:', result.length);
    }
    
    // Lọc theo trạng thái
    if (filters.status !== 'all') {
      result = result.filter(product => product.status === filters.status);
      console.log('After status filter:', result.length);
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset trang khi lọc
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      try {
        // productId phải là số hoặc chuỗi, không phải object
        await api.deleteProduct(productId); // Gọi API xoá
        setProducts(products => products.filter(p => p.id !== productId)); // Xoá khỏi state
        // Có thể thêm thông báo thành công ở đây
      } catch (err) {
        alert('Xoá sản phẩm thất bại!');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    setIsSubmitting(true);
    
    try {
      let updatedProduct;
      
      if (selectedProduct) {
        // Sửa sản phẩm
        updatedProduct = await api.updateProduct(selectedProduct.id, productData);
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? updatedProduct : p
        ));
      } else {
        // Thêm sản phẩm mới
        updatedProduct = await api.createProduct(productData);
        setProducts([...products, updatedProduct]);
      }
      
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      // Hiển thị thông báo lỗi (có thể thêm một state cho thông báo lỗi)
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    
    try {
      await api.deleteProduct(selectedProduct.id);
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: 'all'
    });
  };

  // Cập nhật hàm getUniqueCategories

  const getUniqueCategories = () => {
    // Nếu đã có danh mục từ API, ưu tiên sử dụng
    if (categories && categories.length > 0) {
      console.log('Using API categories:', categories);
      return categories;
    }
    
    // Nếu không có categories nhưng có products, thử lấy từ products
    if (Array.isArray(products) && products.length > 0) {
      console.log('Extracting categories from products:', products.map(p => ({
        name: p.name,
        category: p.category
      })));
      
      const uniqueCategories = products
        .map(p => {
          // Đảm bảo lấy đúng tên danh mục dù là object hay string
          if (p.category && typeof p.category === 'object') {
            return p.category.name;
          }
          return typeof p.category === 'string' ? p.category : 'Không phân loại';
        })
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
      
      console.log('Extracted unique categories:', uniqueCategories);
      return uniqueCategories.length > 0 ? uniqueCategories : ['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad'];
    }
    
    // Trường hợp không có dữ liệu, trả về danh mục mặc định
    console.warn('Products không phải là mảng hoặc rỗng, sử dụng danh mục mặc định');
    return ['Burger', 'Sandwich', 'Món phụ', 'Đồ uống', 'Món chính', 'Salad'];
  };

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggleFeatured = async (productId) => {
    try {
      await toggleProductFeatured(productId); // Đúng hàm
      fetchProducts();
    } catch (err) {
      alert('Lỗi khi thay đổi trạng thái nổi bật!');
    }
  };

  return (
    <div className="product-management">
      <div className="product-list-header">
        <h2 className="list-title">Quản lý Sản phẩm</h2>
        <div className="list-actions">
          <button className="btn-add-product" onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}>
            + Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Bộ lọc sản phẩm */}
      <div className="product-filters">
        <div className="filter-group">
          <label className="filter-label">Tìm kiếm</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Tìm theo tên, mô tả..."
            className="filter-control"
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Danh mục</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-control"
          >
            <option value="">Tất cả danh mục</option>
            {getUniqueCategories().map(category => {
              // Xác định giá trị và text để hiển thị
              const categoryName = typeof category === 'object' ? category.name : category;
              const categoryId = typeof category === 'object' ? category.id : null;
              
              return (
                <option 
                  key={categoryId || categoryName}
                  value={categoryName}
                >
                  {categoryName}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Trạng thái</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-control"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>
        
        <div className="filter-actions">
          <button onClick={resetFilters} className="btn-filter btn-reset">
            Đặt lại
          </button>
        </div>
      </div>

      {/* Hiển thị sản phẩm */}
      {loading ? (
        <div className="product-list-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="product-list-error">
          <p>{error}</p>
          <button onClick={fetchProducts} className="btn-retry">Thử lại</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="product-list-empty">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">Không tìm thấy sản phẩm nào</h3>
          <p className="empty-description">
            {filters.search || filters.category || filters.status !== 'all'
              ? 'Không có sản phẩm nào phù hợp với bộ lọc. Thử thay đổi các điều kiện lọc.'
              : 'Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.'}
          </p>
          {filters.search || filters.category || filters.status !== 'all' ? (
            <button onClick={resetFilters} className="btn-empty-action">
              Xóa bộ lọc
            </button>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="btn-empty-action">
              Thêm sản phẩm
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="product-list">
            {currentProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={() => handleEditProduct(product)} 
                onDelete={() => handleDeleteProduct(product.id)}
                onToggleFeatured={() => handleToggleFeatured(product.id)}
              />
            ))}
          </div>
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="product-list-pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-button"
              >
                &laquo; Trước
              </button>
              
              <div className="pagination-info">
                Trang {currentPage} / {totalPages}
              </div>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Tiếp &raquo;
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal chỉnh sửa/thêm mới sản phẩm */}
      <ProductModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        isSubmitting={isSubmitting}
        categories={getUniqueCategories()} // Truyền danh sách categories từ dữ liệu
      />

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{selectedProduct?.name}</strong>?</p>
            <div className="delete-modal-actions">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="btn-cancel"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete} 
                className="btn-delete"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xóa...' : 'Xóa sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hàm helper để lấy tên category từ ID
const getCategoryNameById = (categoryId) => {
  switch (categoryId) {
    case 1:
      return 'Burger & Sandwich';
    case 2:
      return 'Pizza';
    case 3:
      return 'Gà Rán & Gà Nướng';
    case 4:
      return 'Mì Ý & Pasta';
    case 5:
      return 'Đồ Uống';
    case 6:
      return 'Tráng Miệng';
    default:
      return 'Không phân loại';
  }
};

export default ProductList;