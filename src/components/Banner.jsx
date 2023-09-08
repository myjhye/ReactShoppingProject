import React, { useState } from 'react';
import '../index.css'

export default function Banner() {
  const images = [
    '/images/1.webp',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.webp',
    '/images/5.webp',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="banner-container">
      <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />

      <div className="arrow-container">
        <button className="left-arrow" onClick={goToPreviousImage}>
          &lt;
        </button>
        <button className="right-arrow" onClick={goToNextImage}>
          &gt;
        </button>
      </div>
    </div>
  );
}
