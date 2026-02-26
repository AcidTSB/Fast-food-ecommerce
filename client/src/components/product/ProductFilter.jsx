import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({
  categories = [],
  filters = {},
  onFilterChange,
  onClearFilters,
  productsCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCategoryChange = (categoryId) => {
    console.log('Category selected:', categoryId);
    if (onFilterChange) {
      onFilterChange({ category: categoryId });
    }
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    console.log('Sort changed:', sortBy);
    if (onFilterChange) {
      onFilterChange({ sortBy });
    }
  };

  const handlePriceRangeChange = (e) => {
    const priceRange = e.target.value;
    console.log('Price range changed:', priceRange);
    if (onFilterChange) {
      onFilterChange({ priceRange });
    }
  };

  // Debug logging
  console.log('ProductFilter render:', { categories, filters, productsCount });

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h3>Filter & Sort</h3>
        {onClearFilters && (
          <button 
            onClick={onClearFilters}
            className="clear-filters-btn"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              value="all"
              checked={filters.category === 'all'}
              onChange={() => handleCategoryChange('all')}
            />
            <span>All Items</span>
            <span className="item-count">({productsCount})</span>
          </label>
          
          {Array.isArray(categories) && categories.length > 0 && categories.map(category => {
            // Ensure category has required properties
            if (!category || !category.id) {
              console.warn('Invalid category:', category);
              return null;
            }
            
            return (
              <label key={category.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={filters.category === String(category.id)}
                  onChange={() => handleCategoryChange(String(category.id))}
                />
                <span>{category.name || `Category ${category.id}`}</span>
              </label>
            );
          })}
          
          {!Array.isArray(categories) && (
            <div style={{ color: '#999', fontSize: '14px' }}>
              Categories loading...
            </div>
          )}
          
          {Array.isArray(categories) && categories.length === 0 && (
            <div style={{ color: '#999', fontSize: '14px' }}>
              No categories available
            </div>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <select 
          value={filters.priceRange || 'all'} 
          onChange={handlePriceRangeChange}
          className="filter-select"
        >
          <option value="all">All Prices</option>
          <option value="0-10">Under $10</option>
          <option value="10-20">$10 - $20</option>
          <option value="20-30">$20 - $30</option>
          <option value="30-50">$30 - $50</option>
          <option value="50-999">Over $50</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="filter-section">
        <h4>Sort By</h4>
        <select 
          value={filters.sortBy || 'name'} 
          onChange={handleSortChange}
          className="filter-select"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;