// 장바구니 상품 수량 증가, 감소, 삭제

import React, { useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import the necessary hooks
import { addOrUpdateToCart, removeFromCart } from "../api/firebase";

export default function CartItem({ product, uid }) {

    // 장바구니 상품
    const [productState, setProductState] = useState(product);

    const queryClient = useQueryClient();

    // 상품 수량 감소 처리
    // useMutation: 서버에 데이터 수정 요청 <-> useQuery: 서버에 데이터 조회 요청
    const handleMinus = useMutation(async () => {
            // 수량이 1 이하일 때 감소 중단
            if (productState.quantity < 2) {
                return;
            }
    
            // 장바구니 상품 상태에 수량 -1 반영
            const updatedProduct = {
                ...productState,
                quantity: productState.quantity - 1,
            };
    
            // 서버에 변경된 상품 정보(수량 -1) 반영
            await addOrUpdateToCart(uid, updatedProduct);
    
            // 화면에 변경된 상품 정보(수량 -1) 반영
            setProductState(updatedProduct);
        },
        {
            // 성공 시 후속 작업 
            // 비낙관적 업데이트(서버 응답 후 데이터 재조회하는 로직이라서): 서버 응답 후에만 화면 업데이트, 서버와 클라이언트의 데이터 일관성 중시
            onSuccess: () => {
                // 캐싱된 장바구니 데이터 삭제하고 최신 데이터를 다시 불러와서 실시간 변경을 화면에 반영 (기존 캐싱 데이터를 재사용하는 게 아닌 데이터를 항상 재요청해서 사용)
                queryClient.invalidateQueries("cart");
            },
        }
    );
    
    // 상품 수량 증가
    const handlePlus = useMutation(
        async () => {
            const updatedProduct = {
                ...productState,
                quantity: productState.quantity + 1,
            };
    
            await addOrUpdateToCart(uid, updatedProduct);
    
            setProductState(updatedProduct);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("cart");
            },
        }
    );
    

    
    // 상품 삭제
    const handleDelete = useMutation((productId) => removeFromCart(uid, productId), 
        {
            onSuccess: () => {
                queryClient.invalidateQueries("cart");
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
                    <AiOutlineMinusSquare
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => handleMinus.mutate()}
                    />
                    <span>{productState.quantity}</span>
                    <AiOutlinePlusSquare
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => handlePlus.mutate()}
                    />
                    <RiDeleteBin5Fill
                        className="transition-all cursor-pointer hover:text-brand hover:scale-105 mx-1"
                        onClick={() => handleDelete.mutate(product.id)}
                    />
                </div>
            </div>
        </li>
    );
}
