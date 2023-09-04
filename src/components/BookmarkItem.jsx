import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { removeBookmark } from "../api/firebase";

export default function BookmarkItem({ product, uid }) {

    const queryClient = useQueryClient();
    
    const handleDelete = useMutation(

        () => removeBookmark(uid), 
        
        {
            onSuccess: () => {
                // 카트 데이터 쿼리 무효화하고 다시 불러와서 실시간 변경을 반영
                queryClient.invalidateQueries("bookmarks");
            },
        }
    );
    

    return (
        <li className="flex justify-between my-2 items-center">
            <img
                className="w-24 md:w-48 rounded-lg"
                src={product.image}
                alt={product.title}
            />
            <div className="flex-1 flex justify-between ml-4">
                <div className="basis-3/5">
                    <p className="text-lg">{product.title}</p>
                    <p className="text-xl font-bold text-brand">{product.option}</p>
                    <p>₩{product.price}</p>
                </div>
                <div className="text-2xl flex items-center">
                    <RiDeleteBin5Fill
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => {
                                handleDelete.mutate(uid)
                            }
                        } // Use the mutation here
                    />
                </div>
            </div>
        </li>
    );
}
