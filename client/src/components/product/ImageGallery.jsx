import React, { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ensure we have at least one image
  const imageList = images.length > 0 ? images : ['/images/placeholder-food.jpg'];

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageList.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageList.length - 1 : prev - 1
    );
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="main-image-container">
        <div className={`main-image ${isZoomed ? 'zoomed' : ''}`}>
          <img
            src={imageList[currentImageIndex]}
            alt="Product"
            onClick={toggleZoom}
            onError={(e) => {
              e.target.src = '/images/placeholder-food.jpg';
            }}
          />
          
          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <button 
                className="nav-arrow prev" 
                onClick={prevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                className="nav-arrow next" 
                onClick={nextImage}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="zoom-indicator">
            🔍 Click to {isZoomed ? 'zoom out' : 'zoom in'}
          </div>
        </div>

        {/* Image Counter */}
        {imageList.length > 1 && (
          <div className="image-counter">
            {currentImageIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {imageList.length > 1 && (
        <div className="thumbnail-container">
          {imageList.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                onError={(e) => {
                  e.target.src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;