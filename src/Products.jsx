import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import GenderFilter from "./components/GenderFilter";
import CategoryFilter from "./components/CategoryFilter";
import { useNavigate } from "react-router-dom";
import { BiSolidArrowToTop } from 'react-icons/bi';
import { useAuthContext } from "./context/AuthContext";



export default function Products() {
    
    // 상품 데이터 가져오기
    const { 
        isLoading, 
        error, 
        data: products 
    } = useQuery(['products'], () => getProducts());


    const { 
        recentlyViewed,
        setRecentlyViewed,
        setRecentlyViewedToLocalStorage,
    } = useAuthContext();


    // 상품 목록 정렬 -> 가격, 날짜
    const [sortedProducts, setSortedProducts] = useState(null);
    
    // 선택된 상품 -> sorting
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // 선택된 성별 -> sorting
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);
    
    // 스크롤 시 화면 최상단 이동하는 버튼 보이기 유무
    const [scrollVisible, setScrollVisible] = useState(false);

    // 상품 카테고리, 성별 카테고리 목록
    const mainCategories = ['전체', '원피스', '상의', '하의', '모자', '신발', '기타'];
    const genderCategories = ['전체', '여성', '남성', '공용'];

    const navigate = useNavigate();

    
    
//-------------------- 최근 본 상품


    // 상품 클릭시 로컬 스토리지에 저장 실행 -> setRecentlyViewedToLocalStorage
    useEffect(() => {
        
        // 로컬 스토리지에 최근에 본 상품 목록 저장
        setRecentlyViewedToLocalStorage(recentlyViewed);
    
    }, [recentlyViewed]);




    // 최근에 본 상품 전체 삭제
    const clearRecentlyViewed = () => {

        // 최근에 본 상품 목록 빈 배열로 초기화
        const updatedRecentlyViewed = [];

        // 로컬 스토리지에 초기화된 목록 저장
        setRecentlyViewedToLocalStorage(updatedRecentlyViewed);

        // 최근 본 목록 상태 변수에 초기화된 목록 저장
        setRecentlyViewed(updatedRecentlyViewed);
    }






 //-------------------- 화면 최상단 이동 버튼   



    // 화면 최상단으로 스크롤 핸들러
    const scrollToTop = () => {

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }



    // 화면 스크롤 버튼 보이기 핸들러 
    const handleScroll = () => {
        
        if (window.scrollY > 200) {

            // 화면 아래로 200px 이상 스크롤 시 스크롤 버튼 표시
            setScrollVisible(true);
        
        } else {
        
            // 스크롤이 200px 미만이면 스크롤 버튼 숨김
            setScrollVisible(false);
        }
    };



    // 화면 스크롤 버튼 보이기 핸들러 실행 -> handleScroll
    useEffect(() => {

        // 컴포넌트가 마운트 시 실행 -> 유저가 스크롤 시 -> handleScroll 실행
        window.addEventListener("scroll", handleScroll);
        

        // 컴포넌트가 언마운트(화면 변경 같은) 시 함수 제거 -> 클린업 함수 -> return문에 작성
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };


    // 컴포넌트 마운트 시 한 번만 실행    
    }, []);








//-------------------- 정렬



    // 상품 정렬 핸들러 -> 가격
    const handleSortByPrice = (order) => {
        

        // 정렬된 상품 저장 변수
        let sorted = [...products];


        // 제공된 정렬 순서 -> 오름차순 -> 1, 2, 3...
        if (order === 'asc') {
            
            sorted.sort((a, b) => a.price - b.price);
        
        // 제공된 정렬 순서 -> 내림차순 -> 3, 2, 1...   
        } else if (order === 'desc') {
            
            sorted.sort((a, b) => b.price - a.price);
        
        } 

        // 정렬된 상품 배열로 setSortedProducts 업데이트
        setSortedProducts(sorted);
    };


    // 비교 함수   ->   '(a, b) => a.price - b.price'   ->   a.price - b.price 결과가 양수면 a가 더 크므로 a가 뒤에 위치






    // 상품 정렬 핸들러 -> 날짜
    const handleSortByDate = (order) => {
        
        let sorted = [...products];

        if (order === 'latest') {
        
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        } else if (order === 'oldest') {
        
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        }

        setSortedProducts(sorted);
    };







    
 
//-------------------- 선택 : 상품, 성별   


    // 카테고리 선택 핸들러 -> 상품
    const handleCategorySelect = (category) => {
        
        // 선택한 카테고리가 '전체' -> 선택한 카테고리를 null로 설정 -> 그렇지 않으면 선택한 카테고리를 설정
        setSelectedCategory(category === "전체" ? null : category);
    };




    // 카테고리 선택 핸들러 -> 성별
    const handleGenderCategorySelect = (genderCategory) => {
        
        // 선택한 카테고리가 '전체' -> 선택한 카테고리를 null로 설정 -> 그렇지 않으면 선택한 카테고리를 설정
        setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
    };



    




//-------------------- 필터



    // 필터된 상품 목록
    const filteredProducts = (selectedCategory || selectedGenderCategory)
        
        // sortedProduct 없으면 products 배열로 필터링
        ? (sortedProducts || products).filter((product) => {

            // !selectedCategory -> 선택한 카테고리 없음 -> 자동으로 true 됨
            // product.category === selectedCategory -> 상품 카테고리가 선택한 카테고리와 일치하는지 -> 일치하면 true
            const categoryMatch = !selectedCategory || product.category === selectedCategory;
            const genderCategoryMatch = !selectedGenderCategory || product.gender === selectedGenderCategory;

            // 두 카테고리가 선택한 카테고리와 일치할 경우 -> 둘 다 true 일 경우 -> 결과 목록 반환
            return categoryMatch && genderCategoryMatch;
        })

        // selectedCategory나 selectedGenderCategory 버튼 클릭 안 해서 -> 필터링 안 함
        // sortedProducts 없으면 -> products 배열 사용
        : sortedProducts || products;


    // selectedCategory나 selectedGenderCategory 버튼 클릭 -> 필터링을 함 -> filteredProducts에 할당 -> 둘 다 클릭 안 하면 필터링 안 함







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
                        onClick={clearRecentlyViewed}
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
                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer" 
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