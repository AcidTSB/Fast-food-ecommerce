import React from 'react';

const SearchBox = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBox;