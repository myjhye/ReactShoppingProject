import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "./util/date";
import { AiOutlineMessage } from 'react-icons/ai';
import { getCommentsByProductId } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";

export default function ProductCard({ product }) {

    const navigate = useNavigate();
    const { data: commentData, isLoading } = useQuery(['comments'], () => getCommentsByProductId(product.id));

    const commentCount = commentData?.data?.length ?? 0; // 데이터가 없으면 0을 사용

    return (
        <li
            onClick={() => { navigate(`/products/${product.id}`, { state: { product } }) }}
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
        >
            <img className='w-full' src={product.image} alt={product.title} />
            <div className="mt-2 px-2 text-lg flex justify-between items-center">
                <h3 className="truncate">{product.title}</h3>
                <p>{`₩${product.price}`}</p>
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
