import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";

export default function Products() {

    // usequery로 상품 데이터 가져오기
    const { isLoading, error, data: products } = useQuery(['products'], () => getProducts());
    
    // 가격, 날짜에 따른 상품 목록 정렬
    const [sortedProducts, setSortedProducts] = useState(null);
    
    // 선택된 상품 카테고리
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // 선택된 성별
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);

    // 가격에 따른 상품 정렬 처리
    const handleSortByPrice = (order) => {
        let sorted;

        if (order === 'asc') {
            sorted = [...products].sort((a, b) => a.price - b.price);
        } else if (order === 'desc') {
            sorted = [...products].sort((a, b) => b.price - a.price);
        } else {
            sorted = [...products];
        }

        setSortedProducts(sorted);
    };

    // 날짜에 따른 상품 정렬 처리
    const handleSortByDate = (order) => {
        let sorted;

        if (order === 'latest') {
            sorted = [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (order === 'oldest') {
            sorted = [...products].sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setSortedProducts(sorted);
    };

    // 상품 카테고리를 선택할 때 처리하는 함수 (변경 핸들러)
    const handleCategorySelect = (category) => {
        // 선택한 카테고리가 '전체'면 선택한 카테고리를 null로 설정하고, 그렇지 않으면 선택한 카테고리를 설정
        setSelectedCategory(category === "전체" ? null : category);
    };

    // 성별 카테고리를 선택할 때 처리하는 함수 (변경 핸들러)
    const handleGenderCategorySelect = (genderCategory) => {
        // 선택한 카테고리가 '전체'면 선택한 카테고리를 null로 설정하고, 그렇지 않으면 선택한 카테고리를 설정
        setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
    };

    // 상품 카테고리, 성별 카테고리 목록
    const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발'];
    const genderCategories = ['전체', '여성', '남성', '공용'];

    // 선택한 [상품 카테고리, 성별 카테고리]에 따라 상품 필터링
    const filteredProducts =

        // 사용자가 [상품 카테고리]나 [성별 카테고리] 중 하나를 선택 했다면
        (selectedCategory || selectedGenderCategory) 
            
            // sortedProducts가 있으면 그 배열을 사용하고, 없으면 원본 products 배열 사용
            // sortedProducts => 선택한 카테고리에 따라 정렬된 결과를 기반으로 추가 필터링(가격, 날짜) 적용
            ? (sortedProducts || products) 
                .filter((product) => {
                    
                    // 상품 카테고리 필터 조건 : 선택한 카테고리가 없거나 상품 카테고리가 선택한 카테고리와 일치하는 경우
                    const categoryMatch = !selectedCategory || product.category === selectedCategory;
                    
                    // 성별 카테고리 필터 조건 : 선택한 성별 카테고리가 없거나 성별 카테고리가 선택한 성별 카테고리와 일치하는 경우
                    const genderCategoryMatch = !selectedGenderCategory || product.gender === selectedGenderCategory;
                    
                    // 선택한 의류 카테고리와 성별 카테고리에 모두 해당되는 상품만 필터링해서 반환
                    return categoryMatch && genderCategoryMatch;
            })

            // 선택한 sortedProducts(가격, 날짜 필터링)가 없으면 정렬된 결과나 products(원본 상품 배열)을 필터링 결과로 사용
            : sortedProducts || products;

    return (
        <div className="mt-4">
            <div className="mb-4 space-x-2">
                <Button text={'가격 낮은 순'} onClick={() => handleSortByPrice("asc")} />
                <Button text={'가격 높은 순'} onClick={() => handleSortByPrice("desc")} />
                <Button text={'최신 순'} onClick={() => handleSortByDate("latest")} />
                <Button text={'오래된 순'} onClick={() => handleSortByDate("oldest")} />
            </div>

            <div className="mb-4 space-x-2">
                {mainCategories.map(category => (
                    <label key={category} className="inline-flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category || (selectedCategory === null && category === '전체')}
                            onChange={() => handleCategorySelect(category)}
                            className="mr-1"
                        />
                        {category}
                    </label>
                ))}
            </div>

            <div className="mb-4 space-x-2">
                {genderCategories.map(genderCategory => (
                    <label key={genderCategory} className="inline-flex items-center">
                        <input
                            type="radio"
                            name="genderCategory"
                            value={genderCategory}
                            checked={
                                // 선택한 성별 카테고리와 현재 라디오 버튼의 성별 카테고리가 일치하거나
                                selectedGenderCategory === genderCategory ||
                                // 선택한 성별 카테고리나 'null'이고 현재 라디오 버튼의 성별 카테고리가 '전체'인 경우
                                // 해당 라디오 버튼을 체크한 상태로 설정
                                (selectedGenderCategory === null && genderCategory === '전체')
                            }
                            onChange={() => handleGenderCategorySelect(genderCategory)}
                            className="mr-1"
                        />
                        {genderCategory}
                    </label>
                ))}
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <div>
                    <div>상품 { filteredProducts.length }개</div>
                    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
