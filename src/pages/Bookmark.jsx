import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getBookmarks } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import BookmarkItem from "../components/BookmarkItem";

export default function Bookmark() {
    
    const { uid } = useAuthContext();
    
    // 장바구니 데이터 읽어옴
    const { data: products } = useQuery(['bookmarks'], () => getBookmarks(uid));

    const hasProducts = products.length > 0;

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내 관심 상품</p>
            {!hasProducts && <p>관심 상품이 없습니다!</p>}
            {hasProducts && (
                <>
                    <ul className="border-b border-gray-300 mb-8 p-4 px-8">
                        {products && products.map((product) => (
                            <BookmarkItem
                                key={product.id}
                                product={product}
                                uid={uid}
                            />
                        ))}
                    </ul>
                </>
            )}
        </section>
    )
}
