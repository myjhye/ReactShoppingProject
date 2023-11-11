import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "./util/date";
import { AiOutlineMessage } from 'react-icons/ai';
import { useAuthContext } from "../context/AuthContext";

export default function ProductCard({ product }) {

    const navigate = useNavigate();
    const { handleProductClick } = useAuthContext();

    return (
        <li
            onClick={() => {
                handleProductClick(product); // 최근 본 상품 목록 업데이트
                navigate(`/products/${product.id}`, { state: { product } }); // 페이지 이동
            }}
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
        >
            <img className='w-full' src={product.image} alt={product.title} />
            <div className="mt-2 px-2 text-lg justify-between items-center">
                <h3 className="truncate text-lg">{product.title}</h3>
                <p className="text-xl font-bold">{`${product.price.toLocaleString()}원`}</p>
            </div>
            <p className="mb-2 px-2 text-gray-600">{product.category} / {product.gender}</p>
            <div className="mt-2 px-2 text-lg flex justify-between items-center">
                <p className="mb-2 px-2 text-gray-600">{formatAgo(product.date, 'ko')} 등록</p>
                <p>
                    <AiOutlineMessage />
                </p>
            </div>
        </li>
    )
}