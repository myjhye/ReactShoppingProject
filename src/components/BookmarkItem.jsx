import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { removeBookmark } from "../api/firebase";

export default function BookmarkItem({ bookmark, setBookmarks, uid }) {

    const queryClient = useQueryClient();
    

    const handleDelete = useMutation(

        () => removeBookmark(uid, bookmark.id), 
        
        {
            onSuccess: () => {
                
                // 북마크 데이터 쿼리 무효화 
                queryClient.invalidateQueries("bookmarks");
                
                // 다시 불러와서 실시간 변경을 반영
                setBookmarks((prevBookmarks) =>
                    prevBookmarks.filter((item) => item.id !== bookmark.id)
                );
            },
        }
    );

      

   
    

    return (
        <li className="flex justify-between my-2 items-center">
            <img
                className="w-24 md:w-48 rounded-lg"
                src={bookmark.image}
                alt={bookmark.title}
            />
            <div className="flex-1 flex justify-between ml-4">
                <div className="basis-3/5">
                    <p className="text-lg">{bookmark.title}</p>
                    <p className="text-xl font-bold text-brand">{bookmark.option}</p>
                    <p>₩{bookmark.price}</p>
                </div>
                <div className="text-2xl flex items-center">
                    <RiDeleteBin5Fill
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => handleDelete.mutate(uid, bookmark.id)}
                     />   
                </div>
            </div>
        </li>
    );
}
