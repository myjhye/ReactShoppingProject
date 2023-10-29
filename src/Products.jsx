import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import GenderFilter from "./components/GenderFilter";
import CategoryFilter from "./components/CategoryFilter";
import { useNavigate } from "react-router-dom";
import { BiSolidArrowToTop } from 'react-icons/bi';

// 로컬 스토리지에서 최근에 본 상품 목록을 가져오는 함수
const getRecentlyViewedFromLocalStorage = () => {
    const recentlyViewedJson = localStorage.getItem("recentlyViewed");
    return recentlyViewedJson ? JSON.parse(recentlyViewedJson) : [];
};

// 로컬 스토리지에 최근에 본 상품 목록을 저장하는 함수
const setRecentlyViewedToLocalStorage = (recentlyViewed) => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
};

export default function Products() {
    // usequery로 상품 데이터 가져오기
    const { isLoading, error, data: products } = useQuery(['products'], () => getProducts());

    // 가격, 날짜에 따른 상품 목록 정렬
    const [sortedProducts, setSortedProducts] = useState(null);

    // 선택된 상품 카테고리
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 선택된 성별
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);

    // 최근 본 상품 목록
    const [recentlyViewed, setRecentlyViewed] = useState(getRecentlyViewedFromLocalStorage());

    const [scrollVisible, setScrollVisible] = useState(false);

    const navigate = useNavigate();
    
    


    useEffect(() => {
        // 로컬 스토리지에 최근에 본 상품 목록 저장
        setRecentlyViewedToLocalStorage(recentlyViewed);
    }, [recentlyViewed]);




    // 최상단으로 화면 스크롤
    const scrollToTop = () => {

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Function to handle scrolling and update the visibility of the scroll button
    const handleScroll = () => {
        if (window.scrollY > 200) {
        // Adjust the value (200 in this example) to your desired scroll threshold
        setScrollVisible(true);
        } else {
        setScrollVisible(false);
        }
    };


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);




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
    const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발', '기타'];
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






    const handleProductClick = (product) => {
        
        // 이미 최근에 본 상품 목록에 있는지 확인
        const isAlreadyViewed = recentlyViewed.some((p) => p.id === product.id);

        // 이미 본 상품이 아니라면 목록에 추가
        if (!isAlreadyViewed) {
            // 최근에 본 상품 목록을 최대 5개까지 유지
            const updatedRecentlyViewed = [product, ...recentlyViewed.slice(0, 4)];
            // 로컬 스토리지에 업데이트된 목록 저장
            setRecentlyViewedToLocalStorage(updatedRecentlyViewed);
            // 상태 업데이트
            setRecentlyViewed(updatedRecentlyViewed);
        }
    };


    

    
    // 최근에 본 상품 전체 삭제
    const clearRencentlyViewed = () => {


        // 최근에 본 상품 목록 빈 배열로 초기화
        const updatedRecentlyViewed = [];


        // 로컬 스토리지에 초기화된 목록 저장
        setRecentlyViewedToLocalStorage(updatedRecentlyViewed);


        // 상태 변수에 초기화된 목록 저장
        setRecentlyViewed(updatedRecentlyViewed);
    }
    




    return (
        <div className="mt-4">
            <div className="mb-4 space-x-2">
                {/* Sorting buttons */}
                <Button text={'가격 낮은 순'} onClick={() => handleSortByPrice("asc")} />
                <Button text={'가격 높은 순'} onClick={() => handleSortByPrice("desc")} />
                <Button text={'최신 순'} onClick={() => handleSortByDate("latest")} />
                <Button text={'오래된 순'} onClick={() => handleSortByDate("oldest")} />
            </div>

            <div className="mb-4 flex items-start space-x-6">
                {/* 상품/성별 카테고리 2개 묶기 */}
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

                {/* Rest of the content */}
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
                                                handleProductClick={handleProductClick}
                                            />
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
                
                
                {/* 최근에 본 상품 목록 */}
                <div className="mt-4">
                    <h2 className="mb-2">최근에 본 상품</h2>
                    <button 
                        className="text-sm text-blue-500"
                        onClick={clearRencentlyViewed}
                    >
                        전체 삭제
                    </button>
                    {recentlyViewed.length === 0 ? (
                        <p className="text-sm text-500 mt-10">최근에 본 상품이<br />없습니다</p> 
                    ) : (
                    <ul>
                        {recentlyViewed.map((product) => (
                            <li key={product.id}>
                                <img 
                                    src={product.image} 
                                    alt={product.title}
                                    className="w-24 h-24 object-cover rounded-lg" 
                                    onClick={() => { navigate(`/products/${product.id}`, { state: { product } }); }}
                                />
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>


            {/* 최상단 스크롤 버튼 */}
            {scrollVisible && (
                <div
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 cursor-pointer"
                    style={{
                    width: "56px", 
                    height: "56px", 
                    backgroundColor: "#F96162", 
                    borderRadius: "50%", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    }}
                >
                    <BiSolidArrowToTop size={32} color="white" /> 
                </div>
            )}





            {/* 필터된 상품 없을 때 margin 차이 예방 */}
            <div style={{ height: '500px' }}></div>
        </div>
    );
}