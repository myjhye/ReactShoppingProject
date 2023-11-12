import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import GenderFilter from "../components/GenderFilter";
import SortingButtons from "../components/SortingButtons";

export default function ProductSearch() {

  const { 
        selectedCategory,  
        selectedGenderCategory,
        handleCategorySelect,
        handleGenderCategorySelect,
        handleSortByPrice,
        handleSortByDate,
        filteredResults,
        mainCategories,
        genderCategories
    } = useAuthContext();



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