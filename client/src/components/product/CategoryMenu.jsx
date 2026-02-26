import React from 'react';
import './CategoryMenu.css';

const CategoryMenu = ({ 
  categories = [], 
  activeCategory = 'all', 
  onCategorySelect,
  productsCount = 0 
}) => {
  
  // ADD DEBUG LOGS
  console.log('CategoryMenu received categories:', categories);
  console.log('Categories length:', categories.length);
  console.log('Active category:', activeCategory);
  
  const handleCategoryClick = (categoryId) => {
    console.log('Category clicked:', categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="category-menu">
      <div className="category-menu-container">
        <div className="category-scroll">
          {/* All Items */}
          <button
            className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            <div className="category-icon">🍽️</div>
            <span className="category-name">All Items</span>
            <span className="category-count">{productsCount}</span>
          </button>

          {/* Debug info */}
          {categories.length === 0 && (
            <div style={{ padding: '1rem', color: '#666', fontSize: '12px' }}>
              No categories loaded yet... (Count: {categories.length})
            </div>
          )}

          {/* Category Items */}
          {Array.isArray(categories) && categories.length > 0 && categories.map((category, index) => {
            console.log(`Rendering category ${index}:`, category);
            
            if (!category || !category.id) {
              console.log('Skipping invalid category:', category);
              return null;
            }
            
            // Category icons mapping
            const getIcon = (categorySlug) => {
              const iconMap = {
                'burgers': '🍔',
                'pizza': '🍕',
                'fried-chicken': '🍗',
                'pasta': '🍝',
                'salads': '🥗',
                'sandwiches': '🥪',
                'mexican': '🌮',
                'asian': '🍜',
                'sides': '🍟',
                'desserts': '🍰',
                'beverages': '🥤'
              };
              return iconMap[categorySlug] || '🍴';
            };

            return (
              <button
                key={category.id}
                className={`category-item ${activeCategory === String(category.id) ? 'active' : ''}`}
                onClick={() => handleCategoryClick(String(category.id))}
              >
                <div className="category-icon">
                  {getIcon(category.slug)}
                </div>
                <span className="category-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;