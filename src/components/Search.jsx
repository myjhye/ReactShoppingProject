import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { setCookie, useSearchHistory } from "./util/cookie";
import { searchProductByName } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

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



    // 검색 실행
    const handleSearch = async () => {
        if (searchTerm) {
            if (!searchHistory.includes(searchTerm)) {

                // 검색 기록 업데이트
                const updatedHistory = [searchTerm, ...searchHistory];
                setCookie("searchHistory", updatedHistory.join(","), 30);
                setSearchHistory(updatedHistory);
            }

            // 검색 결과를 가져오고 상태에 저장
            const results = await searchProductByName(searchTerm);
            setSearchResults(results);
        }

        navigate(`/search/${searchTerm}`);

        // 검색 기록 창 닫기
        setIsSearchHistoryOpen(false);
    }




    useEffect(() => {

        // 입력 창 외부 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleOutsideClick);
        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener('click', handleOutsideClick);
        }
    }, []);



    return (
        <div className="w-1/2 flex flex-col items-center p-2 rounded-lg">
            <div className="w-1/2 flex items-center p-2 rounded-lg"> 
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress} // 엔터 키 이벤트 처리
                    className="flex-grow px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mr-2"
                    ref={inputRef}
                    onClick={handleInputClick} 
                />
                <Button text={ '검색' } onClick={handleSearch} />
            </div>
            {isSearchHistoryOpen && (
            <div className="w-full h-px bg-indigo-600 mt-2">
                <ul>
                    {searchHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
          )}
        </div>
    )
}