import React, { useRef, useState } from "react";
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
import Search from "./Search";
import { setCookie, useSearchHistory } from "./util/cookie";

export default function Navbar() {
    const {
        login, 
        user, 
        logout, 
        searchTerm, 
        setSearchTerm, 
        setSearchResults,
    } = useAuthContext();

    const navigate = useNavigate();


    return (
        <header className="flex justify-between border-b border-gray-300 p-2">
            <Link 
                to='/'
                className="flex items-center text-4xl text-brand"
            >
                <FiShoppingBag />
                <h1>Shoppy</h1>
            </Link>
            
            {/* 상품 검색 컴포넌트 */}
            <Search 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setSearchResults={setSearchResults}
                navigate={navigate}
            />

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
