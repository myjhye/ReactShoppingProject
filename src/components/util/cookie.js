import { useEffect, useState } from "react";

// 쿠키 생성
export function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + '; path=/';
}

// 쿠키 가져옴
export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0].trim() === name) {
            return cookie[1];
        }
    }
    return '';
}




// 검색 기록 관리를 위한 커스텀 훅
export function useSearchHistory() {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const storedHistory = getCookie('searchItem');
        if (storedHistory) {
            setSearchHistory(storedHistory.split(','));
        }
    }, []);

    return { searchHistory, setSearchHistory };
}