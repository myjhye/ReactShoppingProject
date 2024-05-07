import React, { useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import the necessary hooks
import { addOrUpdateToCart, removeFromCart } from "../api/firebase";

export default function CartItem({ product, uid }) {

    // 상품의 현재 상태
    const [productState, setProductState] = useState(product);

    // query client 인스턴스
    const queryClient = useQueryClient();

    // 상품 수량 감소 처리하는 mutation
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
    
            // 장바구니의 상품 정보(수량) 업데이트 -> addOrUpdateToCart 함수로 서버에 변경된 상품 정보를 저장
            await addOrUpdateToCart(uid, updatedProduct);
    
            // 해당 상품 정보(수량) 업데이트 -> 화면 반영(**단일 상품) 
            setProductState(updatedProduct);
        },
        {
            // 서버에서 데이터 변경 작업 완료 후 실행 -> 비낙관적 업데이트(응답 후에 화면 반영) -> 장바구니 전체 상품(**)
            onSuccess: () => {
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영 (기존 캐싱 데이터를 재사용하는 게 아닌 데이터를 항상 재요청해서 사용) -> 변경 데이터를 실시간으로 화면에 반영
                queryClient.invalidateQueries("cart");
            },
        }
    );
    
    // 상품 수량 증가 처리하는 mutation
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
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영 (기존 캐싱 데이터를 재사용하는 게 아닌 데이터를 항상 재요청해서 사용) -> 변경 데이터를 실시간으로 화면에 반영
                queryClient.invalidateQueries("cart");
            },
        }
    );
    

    
    // 상품 삭제 처리하는 mutation
    // (productid): 장바구니 제품을 삭제하는 데 필요한 productId 매개변수로 전달
    const handleDelete = useMutation((productId) => removeFromCart(uid, productId), 
        {
            onSuccess: () => {
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영 (기존 캐싱 데이터를 재사용하는 게 아닌 데이터를 항상 재요청해서 사용) -> 변경 데이터를 실시간으로 화면에 반영
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
