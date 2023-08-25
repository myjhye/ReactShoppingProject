import React, { useEffect, useState } from "react"; 
import MyProducts from "../MyProducts";
import { useAuthContext } from "../context/AuthContext";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProducts } from "../api/firebase";

export default function MyProduct() {
    const { uid } = useAuthContext();
    const {
        isLoading, 
        error, 
        data: uploaded 
    } = useQuery(['products', uid], () => getMyProducts(uid));

    // 화면에 표시되는 상품 리스트
    // 초기값으로 'uploaded' 사용 => 이전에 업로드된 상품 리스트
    const [updatedProducts, setUpdatedProducts] = useState([]);

    useEffect(() => {
        if(uploaded) {
            setUpdatedProducts(uploaded);
        }
    }, [uploaded]);

    const handleProductUpdate = (deletedProductId) => {
        // 삭제된 상품 id와 일치하지 않는 상품들로 새로운 배열 생성해 업데이트
        setUpdatedProducts(updatedProducts.filter(product => product.id !== deletedProductId));
    };

    const hasProducts = updatedProducts && updatedProducts.length > 0;

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내가 등록한 상품</p>
            
            {!hasProducts && <p>등록한 상품이 없습니다!</p>}
            {hasProducts && (
                <ul className="border-b border-gray-300 mb-8 p-4 px-8">
                    { updatedProducts && updatedProducts.map((product) => (
                        <MyProducts
                            key={product.id}
                            product={product}
                            uid={uid}
                            onUpdate={handleProductUpdate}
                        />
                    ))}
                </ul>
            )}
        </section>
    )
}