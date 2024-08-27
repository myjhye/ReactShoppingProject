// 장바구니 상품 가격 정보

import React from "react";

export default function PriceCard({ text, price }) {

    return (
        <div className="bg-gray-50 p-8 mx-2 rounded-2xl text-center text-lg md:text-xl">
            <p>{ text }</p>
            {/* 부모 컴포넌트(MyCart)에서 업데이트 된 가격(totalPrice) -> 자식 컴포넌트(PriceCard)에 자동 반영 */}
            <p className="font-bold text-brand text-xl md:text-2xl">₩{ price }</p>
        </div>
    )
}