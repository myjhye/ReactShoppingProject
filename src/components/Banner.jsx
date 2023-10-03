import React, { useEffect, useState } from 'react';
import '../index.css'

export default function Banner() {

  // 이미지 경로
  const images = [
    '/images/1.webp',
    '/images/2.webp',
    '/images/3.webp',
    '/images/4.webp',
    '/images/5.webp',
  ];



  // 각 이미지 링크 url
  const links = [
    'https://kream.co.kr/exhibitions/1872',
    'https://kream.co.kr/exhibitions/1983',
    'https://kream.co.kr/exhibitions/1989',
    'https://kream.co.kr/exhibitions/2016',
    'https://kream.co.kr/exhibitions/1954',
  ]



  // 현재 표시 중인 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  // 이전 이미지 이동 핸들러 -> 현재 이미지 인덱스를 감소 시킴 -> 계산한 인덱스를 setCurrentImageIndex에 전달
  const goToPreviousImage = () => {

    // prevIndex: 현재 이미지 인덱스

    setCurrentImageIndex((prevIndex) =>
      
      // 현재 이미지 인덱스가 0(처음 이미지)이면 images.length - 1(배열 마지막 이미지) 반환

      // 그외 현재 이미지 - 1
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };



  // 다음 이미지 이동 핸들러
  const goToNextImage = () => {

    setCurrentImageIndex((prevIndex) =>

      // 현재 이미지 인덱스가 배열 마지막이면(images.length - 1) -> 0으로 설정(처음 이미지) -> 이미지 순환

      // 그외 현재 이미지 + 1
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };




  // 이미지 클릭 시 해당 링크로 이동 핸들러
  const handleImageClick = () => {

    // currentImageIndex: 현재 표시 중인 이미지 인덱스

    //  window.location.href: 현재 웹 페이지의 url 변경 -> 변경할 대상 url은 클릭된 이미지에 연결된 링크로 설정

    window.location.href = links[currentImageIndex];
  };




  // 5초마다 자동 이미지 넘김
  useEffect(() => {


    // 5초마다 goToNextImage 함수 호출하는 타이머
    const timer = setTimeout(goToNextImage, 5000);



    // 컴포넌트 언마운트(화면 사라짐) 되거나 currentImageIndex 변경 시(사용자가 이미지 변경 화살표 버튼 누름) 타이머 해제
    return () => {
      clearTimeout(timer);
    };



  // currentImageIndex 변경 시 실행 -> 타이머가 해제되어도 자동 변경 활성화 되게 
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