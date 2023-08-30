import React, { useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import the necessary hooks
import { addOrUpdateToCart, getCart, getProducts, removeFromCart } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function CartItem({ product, uid, updateTotalPrice }) {

    // 현재 상품 상태 상태관리    
    const [productState, setProductState] = useState(product);

    // query client 인스턴스
    const queryClient = useQueryClient();

    // 수량 감소하는 useMutation 훅 사용
    const handleMinus = useMutation(
        async () => {
            // 수량이 1 이하일 때 감소 중단
            if (productState.quantity < 2) {
                return;
            }
    
            // 상품 정보 업데이트해서 새로운 정보 변수 생성
            const updatedProduct = {
                ...productState,
                quantity: productState.quantity - 1,
            };
    
            // firebase api로 장바구니의 상품 업데이트
            await addOrUpdateToCart(uid, updatedProduct);
    
            // 상품 상태 업데이트
            setProductState(updatedProduct);
        },
        {
            // 성공 시 실행되는 콜백
            onSuccess: () => {
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영 => 변경 데이터를 실시간으로 화면에 반영
                queryClient.invalidateQueries("cart");
            },
        }
    );
    
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
            // 성공 시 실행되는 콜백
            onSuccess: () => {
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영
                queryClient.invalidateQueries("cart");
            },
        }
    );
    
    const handleDelete = useMutation(

        // (productid): 장바구니 제품을 삭제하는 데 필요한 productId 매개변수로 전달
        (productId) => removeFromCart(uid, productId), 
        {
            onSuccess: () => {
                // 카트 데이터 쿼리 무효화하고 다시 불러와서 실시간 변경을 반영
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
                        onClick={() => handleDelete.mutate(product.id)} // Use the mutation here
                    />
                </div>
            </div>
        </li>
    );
}
