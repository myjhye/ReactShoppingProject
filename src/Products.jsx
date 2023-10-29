import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import GenderFilter from "./components/GenderFilter";
import CategoryFilter from "./components/CategoryFilter";
import { useNavigate } from "react-router-dom";
import { BiSolidArrowToTop } from 'react-icons/bi';






// 로컬 스토리지에 최근에 본 상품 목록 저장
const setRecentlyViewedToLocalStorage = (recentlyViewed) => {


    // 로컬 스토리지에 "recentlyViewed"키로 최근에 본 상품 목록을 json 형식으로 저장
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
};





// 로컬 스토리지에서 최근에 본 상품 목록 가져오기
const getRecentlyViewedFromLocalStorage = () => {

    
    // 로컬 스토리지에서 "recentlyViewed" 키로 저장된 데이터 가져옴 
    const recentlyViewedJson = localStorage.getItem("recentlyViewed");
    
    
    
    // 가져온 데이터가 있으면 json으로 파싱 -> 없으면 빈 배열 반환
    return recentlyViewedJson ? JSON.parse(recentlyViewedJson) : [];
};







export default function Products() {
    
    // 상품 데이터 가져오기
    const { isLoading, error, data: products } = useQuery(['products'], () => getProducts());

    // 가격, 날짜에 따른 상품 목록 정렬
    const [sortedProducts, setSortedProducts] = useState(null);

    // 선택된 상품 카테고리
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 선택된 성별
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);

    // 최근 본 상품 목록
    const [recentlyViewed, setRecentlyViewed] = useState(getRecentlyViewedFromLocalStorage());

    // 스크롤 시 화면 최상단 이동하는 버튼 보이기 유무
    const [scrollVisible, setScrollVisible] = useState(false);



    const navigate = useNavigate();




    
    
//===============================================================================================




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
        
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);





    // 상품 클릭 시 로컬 스토리지에 저장 핸들러
    const handleProductClick = (product) => {
        


        // 최근 본 상품이 목록에 있는 지 확인
        const isAlreadyViewedIndex = recentlyViewed.findIndex((item) => item.id === product.id);
    
        
        // 이미 본 상품이면 
        if (isAlreadyViewedIndex !== -1) {
            
            
            // 목록에서 제거
            const updatedRecentlyViewed = [...recentlyViewed];
            updatedRecentlyViewed.splice(isAlreadyViewedIndex, 1);
    


            // **목록 맨 앞에 다시 추가
            updatedRecentlyViewed.unshift(product);
    


            // 로컬 스토리지에 업데이트 된 목록 업데이트
            setRecentlyViewedToLocalStorage(updatedRecentlyViewed);
            
            // 최근 본 상품 목록 업데이트
            setRecentlyViewed(updatedRecentlyViewed);
        
        


        // 이미 본 상품 아니면    
        } else {


            // 목록에 추가
            const updatedRecentlyViewed = [product, ...recentlyViewed.slice(0, 4)];
    


            // 로컬 스토리지에 업데이트 된 목록 업데이트
            setRecentlyViewedToLocalStorage(updatedRecentlyViewed);

            // 최근 본 상품 목록 업데이트
            setRecentlyViewed(updatedRecentlyViewed);
        }
    };
    

    
    
    
    







    // 상품 클릭시 로컬 스토리지에 저장 실행 -> setRecentlyViewedToLocalStorage
    useEffect(() => {
        
        // 로컬 스토리지에 최근에 본 상품 목록 저장
        setRecentlyViewedToLocalStorage(recentlyViewed);
    
    }, [recentlyViewed]);






    // 가격에 따른 상품 정렬 핸들러
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





    // 날짜에 따른 상품 정렬 핸들러
    const handleSortByDate = (order) => {
        
        let sorted;

        if (order === 'latest') {
        
            sorted = [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        } else if (order === 'oldest') {
        
            sorted = [...products].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        }

        setSortedProducts(sorted);
    };






    // 상품 카테고리 선택 핸들러
    const handleCategorySelect = (category) => {
        
        // 선택한 카테고리가 '전체' -> 선택한 카테고리를 null로 설정 -> 그렇지 않으면 선택한 카테고리를 설정
        setSelectedCategory(category === "전체" ? null : category);
    };




    // 성별 카테고리 선택 핸들러
    const handleGenderCategorySelect = (genderCategory) => {
        
        // 선택한 카테고리가 '전체' -> 선택한 카테고리를 null로 설정 -> 그렇지 않으면 선택한 카테고리를 설정
        setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
    };



    // 상품 카테고리, 성별 카테고리 목록
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