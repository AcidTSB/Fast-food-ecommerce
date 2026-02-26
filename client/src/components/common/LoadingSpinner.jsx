import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClass = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass[size]} ${colorClass[color]}`}>
        <div className="spinner-inner"></div>
        <div className="spinner-inner"></div>
        <div className="spinner-inner"></div>
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
export { LoadingSpinner };