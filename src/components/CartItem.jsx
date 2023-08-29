import React, { useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useAuthContext } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import the necessary hooks
import { addOrUpdateToCart, getCart, removeFromCart } from "../api/firebase";
import { useNavigate } from "react-router-dom";

export default function CartItem({ product, uid, updateTotalPrice }) {
    const [productState, setProductState] = useState(product);
    const queryClient = useQueryClient(); // Initialize query client

    const handleMinus = useMutation(
        async () => {
            if (productState.quantity < 2) {
                return;
            }
    
            const updatedProduct = {
                ...productState,
                quantity: productState.quantity - 1,
            };
    
            await addOrUpdateToCart(uid, updatedProduct);
    
            setProductState(updatedProduct);
        },
        {
            // 성공 시 실행되는 콜백
            onSuccess: () => {
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영합니다.
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
                // 카트 데이터 쿼리를 무효화하고 다시 불러와서 실시간 변경을 반영합니다.
                queryClient.invalidateQueries("cart");
            },
        }
    );
    
    const handleDelete = useMutation(
        (productId) => removeFromCart(uid, productId), // Use the removeFromCart function to perform the deletion
        {
            onSuccess: () => {
                // Invalidate and refetch the cart data query to reflect the changes in real-time
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
