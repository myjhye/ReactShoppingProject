import Button from "./ui/Button";

export default function Search({ searchTerm, setSearchTerm, handleSearch }) {

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



    return (
        <div className="w-1/2 flex items-center p-2 rounded-lg"> 
            <input 
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress} // 엔터 키 이벤트 처리
                className="flex-grow px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 mr-2"
            />
            <Button text={ '검색' } onClick={handleSearch} />
        </div>
    )
}