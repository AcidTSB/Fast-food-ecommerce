import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductList from '../components/product/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import ProductFilter from '../components/product/ProductFilter';
import CategoryMenu from '../components/product/CategoryMenu';
import { useTheme } from '../context/ThemeContext'; // ADD THIS
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'name',
    priceRange: 'all'
  });
  
  const location = useLocation();
  const { isDark } = useTheme(); // ADD THIS

  // Debug dark mode
  console.log('Products Dark Mode:', isDark);

  // Fetch data with better error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching data from API...');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      console.log('Products response:', productsResponse);
      console.log('Categories response:', categoriesResponse);
      
      // Handle different response formats
      let productsData = [];
      let categoriesData = [];
      
      // Extract products data
      if (productsResponse) {
        if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        } else if (productsResponse.data && Array.isArray(productsResponse.data)) {
          productsData = productsResponse.data;
        } else if (productsResponse.products && Array.isArray(productsResponse.products)) {
          productsData = productsResponse.products;
        }
      }
      
      // Extract categories data
      if (categoriesResponse) {
        if (Array.isArray(categoriesResponse)) {
          categoriesData = categoriesResponse;
        } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse.categories && Array.isArray(categoriesResponse.categories)) {
          categoriesData = categoriesResponse.categories;
        }
      }
      
      console.log('Processed products:', productsData);
      console.log('Processed categories:', categoriesData);
      console.log('Categories count:', categoriesData.length);
      
      // Validate and set data
      if (productsData.length === 0) {
        throw new Error('No products found from API');
      }
      
      // Add fallback categories if none from API
      if (categoriesData.length === 0) {
        console.log('No categories from API, using fallback...');
        categoriesData = [
          { id: 1, name: 'Burgers', slug: 'burgers' },
          { id: 2, name: 'Pizza', slug: 'pizza' },
          { id: 3, name: 'Fried Chicken', slug: 'fried-chicken' },
          { id: 4, name: 'Pasta', slug: 'pasta' },
          { id: 5, name: 'Salads', slug: 'salads' },
          { id: 6, name: 'Sandwiches', slug: 'sandwiches' },
          { id: 7, name: 'Mexican', slug: 'mexican' },
          { id: 8, name: 'Asian', slug: 'asian' },
          { id: 9, name: 'Sides', slug: 'sides' },
          { id: 10, name: 'Desserts', slug: 'desserts' },
          { id: 11, name: 'Beverages', slug: 'beverages' }
        ];
      }
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
      
      console.log('Data set successfully - Categories:', categoriesData.length, 'Products:', productsData.length);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products with debugging
  const filterAndSortProducts = useCallback(() => {
    console.log('Starting filter with:', { products: products.length, filters });
    
    if (!products || products.length === 0) {
      console.log('No products to filter');
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];
    console.log('Initial products count:', filtered.length);

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      const initialCount = filtered.length;
      filtered = filtered.filter(product => {
        const productCategoryId = String(product.category_id || product.categoryId || '');
        const filterCategoryId = String(filters.category);
        const matches = productCategoryId === filterCategoryId;
        
        if (!matches) {
          console.log(`Product ${product.name} (category: ${productCategoryId}) doesn't match filter (${filterCategoryId})`);
        }
        
        return matches;
      });
      console.log(`Category filter: ${initialCount} -> ${filtered.length}`);
    }

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const initialCount = filtered.length;
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name && product.name.toLowerCase().includes(searchTerm);
        const descMatch = product.description && product.description.toLowerCase().includes(searchTerm);
        return nameMatch || descMatch;
      });
      console.log(`Search filter: ${initialCount} -> ${filtered.length}`);
    }

    // Apply price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      const initialCount = filtered.length;
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        filtered = filtered.filter(product => {
          const price = Number(product.price);
          return price >= min && price <= max;
        });
        console.log(`Price filter: ${initialCount} -> ${filtered.length}`);
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'rating':
        filtered.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      default:
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    console.log('Final filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [products, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    setFilters(prevFilters => {
      const updated = { ...prevFilters, ...newFilters };
      console.log('Updated filters:', updated);
      return updated;
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    console.log('Clearing all filters');
    setFilters({
      category: 'all',
      search: '',
      sortBy: 'name',
      priceRange: 'all'
    });
  };

  // Handle category selection from CategoryMenu
  const handleCategorySelect = (categoryId) => {
    console.log('Category selected:', categoryId);
    handleFilterChange({ category: categoryId });
  };

  // Effect for initial data fetch
  useEffect(() => {
    fetchData();
    
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [location]);

  // Effect for filtering
  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  if (loading) {
    return (
      <div className={`products-page ${isDark ? 'dark' : ''}`}>
        <div className="container">
          <LoadingSpinner text="Loading delicious food..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`products-page ${isDark ? 'dark' : ''}`}>
        <div className="container">
          <div className="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`products-page ${isDark ? 'dark' : ''}`}>
      <div className="container">
        <div className="products-header">
          <h1 className="page-title">Thực Đơn</h1>
          <p className="page-subtitle">
            Khám phá các món ăn tươi ngon, được chế biến theo yêu cầu
          </p>
        </div>

        {/* CategoryMenu - enhanced styling */}
        <div className="category-menu-wrapper">
          <CategoryMenu
            categories={categories}
            activeCategory={filters.category}
            onCategorySelect={handleCategorySelect}
            productsCount={filteredProducts.length}
          />
        </div>

        {/* Single column layout - no sidebar */}
        <div className="products-content">
          <main className="products-main">
            <div className="products-toolbar">
              <div className="products-info">
                <span className="products-count">
                  Tìm thấy {filteredProducts.length} món ăn
                </span>
                {filters.category !== 'all' && (
                  <span className="active-filter">
                    ở {categories.find(cat => String(cat.id) === String(filters.category))?.name || 'Selected Category'}
                  </span>
                )}
              </div>

              <div className="products-search">
                <SearchBar
                  value={filters.search}
                  onChange={(value) => handleFilterChange({ search: value })}
                  placeholder="Tìm món ngon..."
                />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <ProductList products={filteredProducts} />
            ) : (
              <div className="no-products">
                <h3>Không có món ăn nào</h3>
                <p>Thử đổi món khác xem.</p>
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  Xoá bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;