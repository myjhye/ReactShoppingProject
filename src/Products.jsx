import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import GenderFilter from "./components/GenderFilter";
import CategoryFilter from "./components/CategoryFilter";

export default function Products() {

    // 상품 데이터 가져오기
    const { isLoading, error, data: products } = useQuery(['products'], () => getProducts());
    
    // 가격, 날짜에 따라 정렬된 상품 목록
    const [sortedProducts, setSortedProducts] = useState(null);
    
    // 선택된 상품 카테고리와 성별 카테고리
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);




    // 가격 및 날짜에 따른 상품 정렬
    const handleSort = (field, order) => {

        // 상품 배열 복제 -> 원본 데이터 유지하려고
        const sorted = [...products]
 
        
        // 복제한 상품을 a, b를 가지고 정렬
        sorted.sort((a, b) => {
 

            // 가격
            if (field === 'price') {
                // 오름차순: a - b & 내림차순: b - a
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            

            // 날짜
            } else if (field === 'date') {
                return order === 'oldest' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            }
        });


        // 정렬된 결과를 sortedProducts에 저장
        setSortedProducts(sorted);
    };




    // 카테고리 선택 처리
    const handleCategorySelect = (category) => {

        // 선택한 카테고리가 '전체' -> 선택 해제 -> selectedCategory를 null로

        // 그 외 유저가 선택한 실제 카테고리로 설정 -> category -> 원피스, 상의, 하의....
        setSelectedCategory(category === "전체" ? null : category);
    };




    // 성별 카테고리 선택 처리
    const handleGenderCategorySelect = (genderCategory) => {
        setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
    };




    // 상품 카테고리 & 성별 카테고리 목록
    const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발', '기타'];
    const genderCategories = ['전체', '여성', '남성', '공용'];





    // 필터된 상품 목록
    
    // selectedCategory나 selectedGenderCategory 버튼을 하나라도 클릭 함 -> filteredProducts에 할당(필터링을 함) -> 둘 다 클릭 안 하면 필터링 안 함
    const filteredProducts = (selectedCategory || selectedGenderCategory)


        // selectedCategory나 selectedGenderCategory에 하나라도 값 있어서 필터링

        // sortedProduct 없으면 products 배열로 필터링
        ? (sortedProducts || products).filter((product) => {


            // !selectedCategory -> 선택한 카테고리 없음 -> 자동으로 true 됨
            // product.category === selectedCategory -> 상품 카테고리가 선택한 카테고리와 일치하는지 -> 일치하면 true
            const categoryMatch = !selectedCategory || product.category === selectedCategory;
            
            const genderCategoryMatch = !selectedGenderCategory || product.gender === selectedGenderCategory;
            
            

            // 둘 다 true인 경우에 결과 반환
            return categoryMatch && genderCategoryMatch;
        })



        // selectedCategory나 selectedGenderCategory 버튼 둘 다 클릭 안 해서 필터링 안 함

        // sortedProducts 없으면 products 배열 사용
        : sortedProducts || products;






    return (
        <div className="mt-4">
            <div className="mb-4 mt-12 space-x-2">
                {/* 정렬 버튼 */}
                <Button text={'가격 낮은 순'} onClick={() => handleSort("price", "asc")} />
                <Button text={'가격 높은 순'} onClick={() => handleSort("price", "desc")} />
                <Button text={'최신 순'} onClick={() => handleSort("date", "latest")} />
                <Button text={'오래된 순'} onClick={() => handleSort("date", "oldest")} />
            </div>

            <div className="mb-4 flex items-start space-x-6">
                {/* 상품/성별 카테고리 선택 */}
                <div>
                    <CategoryFilter 
                        mainCategories={mainCategories}
                        selectedCategory={selectedCategory}
                        handleCategorySelect={handleCategorySelect}
                    />
                    <GenderFilter 
                        genderCategories={genderCategories}
                        selectedGenderCategory={selectedGenderCategory}
                        handleGenderCategorySelect={handleGenderCategorySelect}
                    />
                </div>

                {/* 나머지 내용 */}
                <div className="flex-grow w-0">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error.message}</p>
                    ) : (
                        <div>
                            {filteredProducts.length === 0 ? (
                                <p>해당 상품이 없습니다</p>
                            ) : (
                                <>
                                    <div>상품 {filteredProducts.length}개</div>
                                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                        {filteredProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* 필터된 상품 없을 때 여백 추가 */}
            <div style={{ height: '500px' }}></div>
        </div>
    );
}