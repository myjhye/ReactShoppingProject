import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import GenderFilter from "../components/GenderFilter";

export default function ProductSearch() {

  // 검색 결과 가져옴
  const { searchResults } = useAuthContext();


  // 상품 카테고리, 성별 목록
  const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발', '기타'];
  const genderCategories = ['전체', '여성', '남성', '공용'];


  // 선택된 상품, 성별 카테고리
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);




  // 선택된 상품 카테고리 변경
  const handleCategorySelect = (category) => {
    setSelectedCategory(category === "전체" ? null : category);
  };

  // 선택된 성별 변경 
  const handleGenderCategorySelect = (genderCategory) => {
    setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
  };




  // 상품 필터링 
  const filterProducts = (product) => {
    
    // 선택된 상품 카테고리, 성별로 필터링
    const categoryMatch = !selectedCategory || product.category === selectedCategory;
    const genderCategoryMatch = !selectedGenderCategory || product.gender === selectedGenderCategory;
    
    // 선택된 상품 카테고리와 성별 모두 일치하는 상품 반환
    return categoryMatch && genderCategoryMatch;

  };



  // 필터된 상품 목록 => 'searchResults' 배열을 'filterProducts'로 필터링
  const filteredResults = searchResults.filter(filterProducts);




  return (
     <div className="mb-4 flex items-start space-x-6">
        <div>
            {/* 상품 카테고리 필터 버튼 */}
            <CategoryFilter
                mainCategories={mainCategories}
                selectedCategory={selectedCategory}
                handleCategorySelect={handleCategorySelect}
            />
            {/* 성별 필터 버튼 */}
            <GenderFilter
                genderCategories={genderCategories}
                selectedGenderCategory={selectedGenderCategory}
                handleGenderCategorySelect={handleGenderCategorySelect}
            />
        </div>

        <ul className="flex-grow w-0 grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
            {filteredResults.map((product) => (
                <ProductCard 
                    key={product.id}
                    product={product}
                />
            ))}
        </ul>
      </div>
  );
}
