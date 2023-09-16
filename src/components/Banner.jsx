import React, { useEffect, useState } from 'react';
import '../index.css'

export default function Banner() {
  const images = [
    '/images/1.webp',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.webp',
    '/images/5.webp',
  ];

  const links = [
    'https://kream.co.kr/exhibitions/1872',
    'https://kream.co.kr/exhibitions/1983',
    'https://kream.co.kr/exhibitions/1989',
    'https://kream.co.kr/exhibitions/2016',
    'https://kream.co.kr/exhibitions/1954',
  ]

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

  const handleImageClick = () => {
    window.location.href = links[currentImageIndex];
  };


  // 5초마다 이미지 넘김
  useEffect(() => {

    const timer = setTimeout(goToNextImage, 5000);

    return () => {
      clearTimeout(timer);
    };

  }, [currentImageIndex]);

  return (
    <div className="banner-container">
      <img 
        src={images[currentImageIndex]} 
        alt={`Image ${currentImageIndex + 1}`} 
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }} 
      />
      <div className="arrow-container">
        <button 
            className="left-arrow" 
            onClick={goToPreviousImage}
        >
          &lt;
        </button>
        <button 
            className="right-arrow" 
            onClick={goToNextImage}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
