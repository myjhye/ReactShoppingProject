import { createContext, useContext, useEffect, useState } from "react";
import { getBookmarks, getProducts, onUserStateChange } from "../api/firebase";
import { login, logout } from '../api/firebase';



// 컨텍스트 생성
const authContext = createContext();


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


// 인증 관련 컨텍스트
export function AuthContextProvider({ children }) {


    const [product, setProduct] = useState();
    const [user, setUser] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [bookmarks, setBookmarks] = useState([]); 

    // 최근 본 상품 목록
    const [recentlyViewed, setRecentlyViewed] = useState(getRecentlyViewedFromLocalStorage());


    


    // 사용자 로그인 상태 감지 -> 관리자 여부 화면에 전달
    useEffect(() => {
        
        onUserStateChange((user) => {
            console.log(user);
            setUser(user);
        });
        
    }, []);




    // 상품 데이터 가져오기
    useEffect(() => {
        
        getProducts()
            .then((productData) => {
                setProduct(productData);
            })
            .catch((error) =>{
                console.error(error);
            })
    });



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




    // 컨텍스트 값 정의
    const authContextValue = {

        // 현재 사용자 정보
        user: user, 
        
        login: login,
        logout: logout,
        uid: user && user.uid,
        
        // 검색어
        searchTerm: searchTerm,
        
        // 검색어 업데이트
        setSearchTerm: setSearchTerm,
        
        // 검색 결과
        searchResults: searchResults,
        
        // 검색 결과 업데이트
        setSearchResults: setSearchResults,
        
        bookmarks: bookmarks, 

        recentlyViewed: recentlyViewed,

        setRecentlyViewed, setRecentlyViewed,

        handleProductClick: handleProductClick,

        setRecentlyViewedToLocalStorage: setRecentlyViewedToLocalStorage,

        getRecentlyViewedFromLocalStorage: getRecentlyViewedFromLocalStorage,


    
    };



    
    return (
        <authContext.Provider value={authContextValue}>
            {children}
        </authContext.Provider>
    );
}



// 커스텀 훅 (상태 재사용 함수) -> auth 컨텍스트 사용
export function useAuthContext() {
    return useContext(authContext);
}
