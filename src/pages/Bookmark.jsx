import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { getBookmarks } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";
import BookmarkItem from "../components/BookmarkItem";
import { useLocation } from "react-router-dom";

export default function Bookmark() {

    const { uid } = useAuthContext();
    const { data: bookmarks, isLoading, isError } = useQuery(['bookmarks', productId], () => getBookmarks(productId));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching bookmarked products.</div>;
    }

    const hasProducts = bookmarks.length > 0;

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내 관심 상품</p>
            {!hasProducts && <p>관심 상품이 없습니다!</p>}
            {hasProducts && (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <li key={bookmark.productId}>
                            <ul>
                                {Object.values(bookmark.products).map((product) => (
                                    <li key={product.id}>
                                        <BookmarkItem 
                                            product={product} 
                                            uid={uid}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
