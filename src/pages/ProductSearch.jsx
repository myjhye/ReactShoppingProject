import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import GenderFilter from "../components/GenderFilter";
import SortingButtons from "../components/SortingButtons";

export default function ProductSearch() {

  // 검색 결과 가져옴
  const { searchResults } = useAuthContext();


  // 상품 카테고리, 성별 목록
  const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발', '기타'];
  const genderCategories = ['전체', '여성', '남성', '공용'];


  // 선택된 상품, 성별 카테고리
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);

  // 가격, 날짜에 따른 상품 목록 정렬
  const [sortedProducts, setSortedProducts] = useState(null);



  // 가격에 따른 상품 정렬
  const handleSortByPrice = (order) => {

    let sorted;
  
    if (order === 'asc') {
      sorted = (searchResults).sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
      sorted = (searchResults).sort((a, b) => b.price - a.price);
    } 
  
    setSortedProducts(sorted);
  };
  
  
  // 날짜에 따른 상품 정렬 
  const handleSortByDate = (order) => {
    let sorted;
  
    if (order === 'latest') {
      sorted = (searchResults).sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (order === 'oldest') {
      sorted = (searchResults).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  
    setSortedProducts(sorted);
  };
  




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
     <div className="mt-4">
        <SortingButtons
            handleSortByPrice={handleSortByPrice}
            handleSortByDate={handleSortByDate}
        />

        <div className="mb-4 flex items-start space-x-6">
            {/* 상품 카테고리 필터 버튼 */}
            <div>
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

            <div className="flex-grow w-0">
                <div>
                    {filteredResults.length === 0 ? (
                        <p>해당 상품이 없습니다</p>
                    ) : (
                        <>
                            <div>상품 {filteredResults.length}개</div>
                            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {filteredResults.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>


        </div>
        {/* 필터된 상품 없을 때 margin 차이 예방 */}
        <div style={{ height: '500px' }}></div>
      </div>
  );
}
