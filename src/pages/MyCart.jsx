// 장바구니

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getCart } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { FaEquals } from 'react-icons/fa';
import CartItem from "../components/CartItem";
import PriceCard from "../components/PriceCard";
import Button from "../components/ui/Button";

// 배송비 상수
const SHIPPING = 3000;

export default function MyCart() {
    
    const { uid } = useAuthContext();
    
    // 장바구니 상품 조회
    const { data: products } = useQuery(['carts'], () => getCart(uid));

    // 장바구니 내 모든 상품 총 가격 계산
    const updateTotalPrice = () => {
        
        // reduce: 배열의 모든 요소를 순회하면서, 누적된 값 계산해 하나의 결과로 반환
        // prev: 누적 값, 초기 값은 0
        // current.price * current.quantity 요소를 prev 변수에 다 더하기
        return products.reduce((prev, current) => prev + parseInt(current.price) * current.quantity, 0);
    }

    // 장바구니 총 가격
    const [totalPrice, setTotalPrice] = useState(updateTotalPrice);

    // 장바구니 데이터(가격, 수량)가 변경될 때마다 -> 총 가격 업데이트 (useEffect 사용)
    useEffect(() => { 
        setTotalPrice(updateTotalPrice);
    }, [products]);

    // 장바구니에 상품이 있는지 확인
    const hasProducts = products.length > 0;

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내 장바구니</p>
            {!hasProducts && <p>장바구니에 상품이 없습니다!</p>}
            {hasProducts && (
                <>
                    <ul className="border-b border-gray-300 mb-8 p-4 px-8">
                        {products && products.map((product) => (
                            <CartItem
                                key={product.id}
                                product={product}
                                uid={uid}
                            />
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-6 px-2 md:px-8 lg:px-16">
                        <PriceCard
                            text='상품 총액'
                            price={totalPrice}
                        />
                        <BsFillPlusCircleFill className="shrink-0" />
                        <PriceCard
                            text='배송액'
                            price={SHIPPING}
                        />
                        <FaEquals className="shrink-0" />
                        <PriceCard
                            text='총 가격'
                            price={totalPrice + SHIPPING}
                        />
                    </div>
                    <Button text='주문하기' />
                </>
            )}
        </section>
    )
}
