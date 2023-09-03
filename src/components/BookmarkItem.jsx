import React, { useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import the necessary hooks
import { removeBookmark, removeFromCart } from "../api/firebase";

export default function BookmarkItem({ product, uid }) {

    // 현재 상품 상태 상태관리    
    const [productState, setProductState] = useState(product);

    // query client 인스턴스
    const queryClient = useQueryClient();

    const handleDelete = useMutation(

        // (productid): 장바구니 제품을 삭제하는 데 필요한 productId 매개변수로 전달
        (productId) => removeBookmark(uid, productId), 
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
                src={productState.image}
                alt={productState.title}
            />
            <div className="flex-1 flex justify-between ml-4">
                <div className="basis-3/5">
                    <p className="text-lg">{productState.title}</p>
                    <p className="text-xl font-bold text-brand">{productState.option}</p>
                    <p>₩{productState.price}</p>
                </div>
                <div className="text-2xl flex items-center">
                    <RiDeleteBin5Fill
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => handleDelete.mutate(product.id)} // Use the mutation here
                    />
                </div>
            </div>
        </li>
    );
}
