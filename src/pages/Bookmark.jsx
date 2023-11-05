import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getBookmarks } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";
import BookmarkItem from "../components/BookmarkItem";

export default function Bookmark() {

    const [bookmarks, setBookmarks] = useState([]);
    
    const { user, uid }  = useAuthContext();
    const hasProducts = bookmarks.length > 0;


    // 북마크 가져오기
    useEffect(() => {
        if (user && user.uid) {
            getBookmarks(user.uid)
                .then((bookmarksData) => {
                    setBookmarks(bookmarksData);
                    console.log(bookmarksData)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    //console.log('bookmarks:', bookmarks);

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내 관심 상품</p>
            {!hasProducts && <p>관심 상품이 없습니다!</p>}
            {hasProducts && (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <li key={bookmark.id}>
                            <ul>
                                <BookmarkItem 
                                    bookmark={bookmark}
                                    setBookmarks={setBookmarks}
                                    uid={uid} 
                                />
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
