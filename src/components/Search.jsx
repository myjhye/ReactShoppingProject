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
    
    const inputRef = useRef(null);
    
    const { setSearchResults } = useAuthContext();


    
    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }



    // 엔터 키 눌렀을 때 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }



    // 검색 창 내부 클릭 => 검색 기록 창 열기
    const handleInputClick = () => {
        setIsSearchHistoryOpen(true);
    }



    // 검색 창 외부 클릭 => 검색 기록 창 닫기
    const handleOutsideClick = (e) => {
        if (!inputRef.current || !inputRef.current.contains(e.target)) {
            setIsSearchHistoryOpen(false);
        }
    }

    // 쿠키에서 검색 기록 로드 => 검색 기록 쿠키 가져와서 배열에 추가 => 이 함수 없으면 searchItem 쿠키 데이터가 다른 쿠키 데이터로 바뀜
    const loadSearchHistory = () => {
    
        // searchHistory 이름의 쿠키 가져옴 
        const storedHistory = getCookie("searchItem");

        if (storedHistory) {
            // 가져온 쿠키('검색어1, 검색어2, 검색어3')를 ,로 분리해서 검색 기록에 추가
            setSearchHistory(storedHistory.split(","));
        }

    };


    useEffect(() => {
        loadSearchHistory();
    }, []);



    // 검색 실행
    const handleSearch = async () => {
        if (searchTerm) {
            // 기존 검색어와 동일한 검색어가 있는지 확인
            const index = searchHistory.indexOf(searchTerm);
            if (index !== -1) {
                // 해당 검색어를 검색 기록에서 제거
                const updatedHistory = [...searchHistory];
                updatedHistory.splice(index, 1);
                setSearchHistory(updatedHistory);
            }
    



            // 검색 기록 업데이트

            // 신규 검색어를 맨 앞에 추가하고 중복 제거
            const updatedHistory = [searchTerm, ...searchHistory.filter(item => item !== searchTerm)].slice(0, 5); 
            setCookie("searchItem", updatedHistory.join(','), 30);
            setSearchHistory(updatedHistory);
    
            // 검색 결과를 가져오고 상태에 저장
            const results = await searchProductByName(searchTerm);
            setSearchResults(results);
        }
    
        navigate(`/search/${searchTerm}`);
    
        // 검색 기록 창 닫기
        setIsSearchHistoryOpen(false);
    }



    // 검색 기록 삭제
    const handleDeleteSearchHistory = (term, e) => {
        
        // 삭제 버튼 클릭 시에도 기록 창이 닫히지 않음
        e.stopPropagation();
    
        // 선택한 검색어를 검색 기록에서 제거
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


    // 검색 기록 항목 클릭 시 해당 검색어로 검색 실행
    const handleHistoryClick = async (item) => {
        
        setSearchTerm(item);
        navigate(`/search/${item}`);
    };




    return (
        <div className="relative w-1/2 flex flex-col items-center p-2 rounded-lg">
          <div className="w-1/2 flex items-center p-2 rounded-lg"> 
            <input 
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
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