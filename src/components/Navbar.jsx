import React from "react";
import { FiShoppingBag } from 'react-icons/fi';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaBookmark } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { searchProductByName } from "../api/firebase";
import User from "../User/User";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import CartStatus from "./CartStatus";
import { FcGoogle } from 'react-icons/fc';

export default function Navbar() {
    const {
        login, 
        user, 
        logout, 
        searchTerm, 
        setSearchTerm, 
        setSearchResults,
    } = useAuthContext();


    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const navigate = useNavigate();

    // 검색 실행 핸들러
    const handleSearch = async () => {
        const results = await searchProductByName(searchTerm);
        setSearchResults(results);
        console.log("result: " + results);

        navigate('/search');
    }


    // 엔터 키 눌렀을 때 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <header className="flex justify-between border-b border-gray-300 p-2">
            <Link 
                to='/'
                className="flex items-center text-4xl text-brand"
            >
                <FiShoppingBag />
                <h1>Shoppy</h1>
            </Link>
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


            <nav className="flex items-center gap-4 font-semibold">
                { user && (
                    <Link to='/carts'>
                        <CartStatus />
                    </Link>
                )}
                { user && (
                    <Link
                        to='/bookmark' 
                        className="text-2xl"
                    >
                        <FaBookmark />
                    </Link>
                )}
                { user && (
                    <Link 
                        to='/products/new'
                        className="text-2xl"
                    >
                        <BsFillPencilFill />
                    </Link>
                )}
                { user && (
                    <Link to='/uploaded'>
                        <User user={ user } />
                    </Link>
                )}
                {!user && <FcGoogle className="text-4xl cursor-pointer" onClick={login} />}
                {!user && (
                    <Link to='signup'>
                        <button>회원가입</button>
                    </Link> 
                )}
                {!user && (
                    <Link to='login'>
                        <button>로그인</button>
                    </Link> 
                )}
                { user  && <Button text={ 'Logout' } onClick={ logout }  />}
            </nav>
        </header>
    )
}
