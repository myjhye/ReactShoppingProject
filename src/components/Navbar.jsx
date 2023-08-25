import React, { useEffect, useState } from "react";
import { FiShoppingBag } from 'react-icons/fi';
import { BsFillPencilFill } from 'react-icons/bs';
import { Link } from "react-router-dom";
import { login, logout, onUserStateChange, searchProductByName } from "../api/firebase";
import User from "../User/User";
import Button from "./ui/Button";
import { useAuthContext } from "../context/AuthContext";
import CartStatus from "./CartStatus";

export default function Navbar() {

    const authContext = useAuthContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]); 

    // 검색어 변경 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    // 검색 실행 핸들러
    const handleSearch = async () => {
        const results = await searchProductByName(searchTerm);
        setSearchResults(results);
        console.log("result: " + results);
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
        <input 
            type="text"
            value={searchTerm}
            onChange={handleSearchChange} 
        />
        <button onClick={handleSearch}>검색</button>
        <div>
            {searchResults.map((product) => (
                <div key={product.id}>{product.title}</div>
            ))}
        </div>
        <nav className="flex items-center gap-4 font-semibold">
            <Link to='/carts'>
                <CartStatus />
            </Link>
            <Link 
                to='/products/new'
                className="text-2xl"
            >
                <BsFillPencilFill />
            </Link>
            { authContext.user && (
                <Link to='/uploaded'>
                    <User user={ authContext.user } />
                </Link>
            )} {/* 로그인한 유저 정보 전달 */}
            { !authContext.user  && <Button text={ 'Login' } onClick={ authContext.login } /> }
            { authContext.user  && <Button text={ 'Logout' } onClick={ authContext.logout }  /> }
        </nav>
        </header>
    )
}