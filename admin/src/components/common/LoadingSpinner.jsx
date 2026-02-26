import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  );
};

// Thêm cả default export và named export
export default LoadingSpinner;
export { LoadingSpinner };