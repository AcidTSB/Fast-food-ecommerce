import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const history = useHistory();

  // Popular searches
  const popularSearches = [
    'Burger', 'Pizza', 'Mì'
  ];

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onChange(searchTerm);
      // Using history to navigate on search
      history.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onChange(term);
    
    if (term.length > 0) {
      // Filter suggestions based on input
      const filtered = popularSearches.filter(item =>
        item.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchTerm.length === 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="search-suggestions">
            {suggestions.length > 0 ? (
              <>
                <div className="suggestions-header">Suggestions</div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">🔍</span>
                    {suggestion}
                  </div>
                ))}
              </>
            ) : searchTerm ? (
              <div className="no-suggestions">
                No suggestions found
              </div>
            ) : (
              <>
                <div className="suggestions-header">Popular Searches</div>
                {popularSearches.map((search, index) => (
                  <div
                    key={index}
                    className="suggestion-item popular"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <span className="suggestion-icon">🔥</span>
                    {search}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;