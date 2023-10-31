import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { getCookie, setCookie, useSearchHistory } from "./util/cookie";
import { searchProductByName } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { BsArrowClockwise } from 'react-icons/bs';

export default function Search({ searchTerm, setSearchTerm, navigate }) {

    // 검색 기록
    const { searchHistory, setSearchHistory } = useSearchHistory();
    
    // 검색 기록 창 열고 닫기
    const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
    
    // 검색어 입력 필드
    const inputRef = useRef(null);

    
    // 검색 결과 상태
    const { setSearchResults } = useAuthContext();



    

    // 엔터 키 눌렀을 때 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }



    // 검색 창 내부 클릭 -> 검색 기록 창 열기
    const handleInputClick = () => {

        setIsSearchHistoryOpen(true);
    }



    // 검색 창 외부 클릭 -> 검색 기록 창 닫기
    const handleOutsideClick = (e) => {

        if (!inputRef.current || !inputRef.current.contains(e.target)) {
            
            setIsSearchHistoryOpen(false);
        }
    }




    // 저장된 검색 기록을 쿠키에서 가져와서 상태에 반영
    const loadSearchHistory = () => {
    
        
        // 'searchHistory' 이름의 쿠키 가져오기
        const storedHistory = getCookie("searchItem");


        if (storedHistory) {

            // 가져온 쿠키('검색어1, 검색어2, 검색어3')를 쉼표(,)로 분리해서 검색 기록 상태에 저장
            setSearchHistory(storedHistory.split(","));
        }

    };




    // 저장된 검색 기록 쿠키에서 가져오기 -> 초기 렌더링 시
    useEffect(() => {

        loadSearchHistory();
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



            // 검색 기록 상태에 업데이트된 검색 기록 저장
            setSearchHistory(updatedHistory);
    

            
            
            // 검색 결과를 가져오고 상태에 저장
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




    useEffect(() => {

        // 입력 창 외부 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleOutsideClick);
        
        return () => {
            
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener('click', handleOutsideClick);
        }

    }, []);




    // 검색 기록 항목 클릭 -> 해당 검색어로 검색 실행
    const handleHistoryClick = async (term) => {
        
        
        setSearchTerm(term);

        
        // 검색 결과 가져와서 상태에 저장
        const results = await searchProductByName(term);
        setSearchResults(results);


        // 검색 결과 페이지로 이동
        navigate(`/search/${term}`);

        
    };




    return (
        <div className="relative w-1/2 flex flex-col items-center p-2 rounded-lg">
          <div className="w-1/2 flex items-center p-2 rounded-lg"> 
            <input 
              type="text"
              value={searchTerm}
              onChange={ (e) => setSearchTerm(e.target.value) }
              onKeyPress={handleKeyPress}
              className="flex-grow px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mr-2"
              ref={inputRef}
              onClick={handleInputClick} 
            />
            <Button text={'검색'} onClick={handleSearch} />
          </div>
          {isSearchHistoryOpen && (
            <div className="absolute top-full left-0 w-full bg-white z-10 mt-2">
                <ul className="list-none p-0">
                    
                    {searchHistory.map((item, index) => (
                        <li className="py-3 px-4 border-b border-gray-200 relative flex items-center" key={index}>
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