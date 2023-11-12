import React, { useState, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import GenderFilter from "./components/GenderFilter";
import CategoryFilter from "./components/CategoryFilter";
import { useNavigate } from "react-router-dom";
import { BiSolidArrowToTop } from 'react-icons/bi';
import { useAuthContext } from "./context/AuthContext";



export default function Products() {
    
    const { 
        recentlyViewed,
        setRecentlyViewed,
        setRecentlyViewedToLocalStorage,
        selectedCategory,  
        selectedGenderCategory,
        handleCategorySelect,
        handleGenderCategorySelect,
        handleSortByPrice,
        handleSortByDate,
        filteredResults,
        mainCategories,
        genderCategories,
    } = useAuthContext();


    
    // 스크롤 시 화면 최상단 이동하는 버튼 보이기 유무
    const [scrollVisible, setScrollVisible] = useState(false);
    const navigate = useNavigate();
    
    



    // 상품 클릭시 로컬 스토리지에 저장 실행 -> setRecentlyViewedToLocalStorage
    useEffect(() => {
        
        // 로컬 스토리지에 최근에 본 상품 목록 저장
        setRecentlyViewedToLocalStorage(recentlyViewed);
    
    }, [recentlyViewed]);




    // 최근에 본 상품 전체 삭제
    const clearRencentlyViewed = () => {


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