import React, { useEffect, useState } from "react"; 
import { useAuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMyCommentsWithProductData } from "../api/firebase"; // 수정된 함수를 가져옵니다.
import { useNavigate } from "react-router-dom";

export default function MyComment() {
    const { uid } = useAuthContext();
    const { data: myCommentsWithProductTitles } = useQuery(['commentsWithProductTitles', uid], () => getMyCommentsWithProductData(uid)); // 수정된 함수를 호출합니다.

    const hasProducts = myCommentsWithProductTitles && myCommentsWithProductTitles.length > 0;
    const navigate = useNavigate();

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내가 등록한 상품</p>
            
            <div className="flex">
                <button onClick={() => navigate('/myProduct')}>내가 등록한 상품</button>
                <button onClick={() => navigate('/myComment')}>내가 등록한 댓글</button>
            </div>
            
            {!hasProducts && <p>작성한 댓글이 없습니다!</p>}
            {hasProducts && (
                <ul className="border-b border-gray-300 mb-8 p-4 px-8">
                    {myCommentsWithProductTitles && myCommentsWithProductTitles.map((comment) => (
                        <div key={comment.id}>
                            <li>{comment.date}</li>
                            <li>{comment.userName}</li>
                            <li>{comment.text}</li>
                            <li onClick={() => navigate(`/products/${comment.productId}`, { state: { product: comment.productData } })}>
                                {comment.productData.title}
                            </li>
                        </div>
                    ))}
                </ul>
            )}
        </section>
    )
}
