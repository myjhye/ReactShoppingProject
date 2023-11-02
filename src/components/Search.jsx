import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { getCookie, setCookie, useSearchHistory } from "./util/cookie";
import { getProducts, searchProductByName } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { BsArrowClockwise } from 'react-icons/bs';

export default function Search({ searchTerm, setSearchTerm, navigate }) {

    // 검색 기록
    const { searchHistory, setSearchHistory } = useSearchHistory();
    
    
    // 검색 기록 창 열고 닫기
    const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);

    
    // 검색어 입력 필드
    const inputRef = useRef(null);

    
    // 검색 결과
    const { setSearchResults } = useAuthContext();


    // 자동 완성 결과
    const [autoCompleteResults, setAutoCompleteResults] = useState([]);

    
    // 검색어 자동 완성
    const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);
    

    // 검색어 자동 완성 창 열고 닫기 
    const [showAutoComplete, setShowAutoComplete] = useState(false);



    

    // 엔터 키 누름 -> 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }



    // 검색 창 내부 클릭 -> 검색 기록 창 열기
    const handleInputClick = () => {


        if (searchTerm) {

          setIsSearchHistoryOpen(false);

        } else {

          setIsSearchHistoryOpen(true);
        }
         
    }



    // 검색 창 외부 클릭 -> 검색 기록 창 닫기
    const handleOutsideClick = (e) => {


         // 클릭한 곳이 검색 창(inputRef) 외부라면
         if (!inputRef.current || !inputRef.current.contains(e.target)) {
            
            
             // 검색 기록 창 닫기
             setIsSearchHistoryOpen(false);
         }
     }






    // 검색 창 외부 클릭 -> 검색어 자동 완성 창 닫기
    const handleSuggestionOutsideClick = (e) => {


        // 클릭한 곳이 검색 창(inputRef) 외부라면
        if (!inputRef.current || !inputRef.current.contains(e.target)) {
            
            
            // 검색 기록 창 닫기
            setShowAutoComplete(false);
        }
    }




    // 저장된 검색 기록을 쿠키에서 가져옴 -> 상태에 반영
    const loadSearchHistory = () => {
    
        
        // 'searchHistory' 이름의 쿠키 가져오기
        const storedHistory = getCookie("searchItem");


        if (storedHistory) {

            // 가져온 쿠키('검색어1, 검색어2, 검색어3')를 쉼표(,)로 분리 -> 검색 기록 상태에 저장
            setSearchHistory(storedHistory.split(","));
        }

    };




    // 저장된 검색 기록 쿠키에서 가져오기 -> 초기 렌더링 시
    useEffect(() => {

        loadSearchHistory();
    }, []);




    // 이벤트 리스너 -> 외부 클릭
    useEffect(() => {

        // 입력 창 외부 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleSuggestionOutsideClick);
        
        return () => {
            
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener('click', handleOutsideClick);
        }

    }, []);





    



    // 검색 실행 핸들러
    const handleSearch = async () => {
        


        // 검색어가 있는 경우만 실행
        if (searchTerm) {
            

            // 기존 검색 기록에서 현재 검색어의 순서 확인
            const index = searchHistory.indexOf(searchTerm);
            


            // 기존 검색어와 동일한 검색어가 있다면 -> 기존 검색 기록에 검색어가 없으면 -1
            if (index !== -1) {
                
                
                const updatedHistory = [...searchHistory];
                

                // 해당 검색어를 검색 기록에서 제거
                updatedHistory.splice(index, 1);

                setSearchHistory(updatedHistory);
            }
    



            // 신규 검색어를 맨 앞에 추가하고 중복 제거
            const updatedHistory = [
                
                searchTerm, 
                ...searchHistory.filter((item) => item !== searchTerm)
            
            ].slice(0, 5); 
            


            // 쿠키에 업데이트 된 검색 기록 저장 -> 유효기간 30일
            setCookie("searchItem", updatedHistory.join(','), 30);



            // 업데이트된 검색 기록 -> 상태에 저장
            setSearchHistory(updatedHistory);
    

            
            
            // 검색 결과를 가져옴 -> 상태에 저장
            const results = await searchProductByName(searchTerm);
            
            setSearchResults(results);
        }
    

        // 검색 결과 페이지로 이동
        navigate(`/search/${searchTerm}`);
    


        // 검색 기록 창 닫기
        setIsSearchHistoryOpen(false);
    }










    // 검색 기록 삭제 핸들러
    const handleDeleteSearchHistory = (term, e) => {
        


        // 삭제 버튼 클릭 시에도 기록 창이 닫히지 않음
        e.stopPropagation();
    


        // 선택한 검색어를 검색 기록에서 제거 -> searchHistory 배열(검색 기록)에서 term(삭제하는 검색어)과 일치하지 않는 요소만 남김
        const updatedHistory = searchHistory.filter((item) => item !== term);
        setSearchHistory(updatedHistory);
    


        // 업데이트 된 검색 기록 쿠키에 저장
        setCookie("searchItem", updatedHistory.join(","), 30); 
    }








    // 검색 기록 항목 클릭 -> 해당 검색어로 검색 실행
    const handleHistoryClick = async (term) => {
        
        
        setSearchTerm(term);

        
        // 검색 결과 가져와서 상태에 저장
        const results = await searchProductByName(term);
        setSearchResults(results);


        // 검색 결과 페이지로 이동
        navigate(`/search/${term}`);

        
    };





  



  const handleInputChange = async (e) => {
    
    
    // 입력된 검색어 가져오기
    const inputText = e.target.value;
    
    // 검색어 상태 업데이트
    setSearchTerm(inputText);
  


    // 입력 단어가 없을 시
    if (inputText.trim().length <= 1) {

      // 검색 기록 창 닫기  
      setIsSearchHistoryOpen(false);
    }







    // 입력 단어가 있을 시
    if (inputText.trim() !== "") {


      // api에서 상품 목록 가져오기
      const products = await getProducts();
  

      // 상품 제목만 추출
      const productTitles = products.map((product) => product.title);
  


      // 입력된 검색어를 포함하는 상품 제목을 필터링
      const filteredResults = productTitles.filter((title) =>
        
        title.toLowerCase().includes(inputText.toLowerCase())
      );
  

      // 검색어 자동 완성 결과 값 적용
      setAutoCompleteSuggestions(filteredResults);
      

      // 검색어 자동 완성 창 열기
      setShowAutoComplete(true);
    
    


    // 입력 단어가 비어 있을 경우
    } else {


      // 검색어 자동 완성 결과 값 초기화  
      setAutoCompleteSuggestions([]);


      // 검색어 자동 완성 창 닫기
      setShowAutoComplete(false);
    }
  };





  


  const handleAutoCompleteClick = (suggestion) => {
    
    // 클릭한 자동 완성 검색어를 검색어로 설정
    setSearchTerm(suggestion);

    // 검색 실행
    handleSearch();

    // 자동 완성 창 닫기
    setShowAutoComplete(false);
  };





  return (
    <div className="relative w-1/2 flex flex-col items-center p-2 rounded-lg">
      <div className="w-full flex items-center p-2 rounded-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-grow px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mr-2"
          ref={inputRef}
          onClick={handleInputClick}
        />
        <Button text={"검색"} onClick={handleSearch} />
      </div>


      {/* 검색어 제안 */}
      {showAutoComplete && autoCompleteSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white z-10 mt-2">
          <ul className="list-none p-0">
            {autoCompleteSuggestions.map((suggestion, index) => (
              <li
                className="py-3 px-4 border-b border-gray-200 relative flex items-center cursor-pointer"
                key={index}
                onClick={() => handleAutoCompleteClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* 검색어 기록 */}
      {isSearchHistoryOpen && (
        <div className="absolute top-full left-0 w-full bg-white z-10 mt-2">
          <ul className="list-none p-0">
            {searchHistory.map((item, index) => (
              <li
                className="py-3 px-4 border-b border-gray-200 relative flex items-center"
                key={index}
              >
                <BsArrowClockwise
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHistoryClick(item)}
                />
                <span
                  className="flex-grow pointer"
                  onClick={() => handleHistoryClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item}
                </span>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={(e) => handleDeleteSearchHistory(item, e)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}