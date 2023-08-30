import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { addOrUpdateToCart, getCart } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";

export default function ProductDetail() {

    // context에서 사용자 uid 가져옴
    const { uid } = useAuthContext();

    // 현재 페이지 컴포넌트에서 사용할 product 정보를 가져옴
    const { state: { product } } = useLocation();
    
    // 선택된 옵션을 상태로 관리
    const [ selected, setSelected ] = useState(product.options[0]);
    
    // 옵션 선택 핸들러
    const handleSelect = (e) => setSelected(e.target.value);

    // 사용자의 장바구니 정보 가져옴
    const { data: cartData } = useQuery(['carts'], () => getCart(uid));
    
    // 선택된 제품과 옵션이 장바구니에 이미 있는지 확인
    const isProductInCart = cartData && cartData.some((item) =>
        item.id === product.id && item.option === selected
    );


    // '장바구니에 추가' 버튼 클릭 핸들러
    const handleClick = () => {

        if(isProductInCart) 
        {
            alert('이미 장바구니에 추가된 상품입니다!');
        } 
        else 
        {
            // 사용자가 지정한 제품 정보를 가지고 장바구니에 추가
            const products = {
                id: product.id,
                image: product.image,
                title: product.title,
                price: product.price,
                option: selected,
                quantity: 1
            };

            // 장바구니에 제품 추가
            addOrUpdateToCart(uid, products);

            alert('제품이 장바구니에 추가 되었습니다!');
        }
    }


    return (
        <>
            <p className="mx-12 mt-4 text-gray-700">{ product.category } / { product.gender }</p>
            <section className="flex flex-col md:flex-row p-4">
                <img className="max-w-xl mx-auto px-4" src={product.image} alt={product.title} />
                <div className="w-full basis-5/12 flex flex-col p-4">
                    <h2 className="text-3xl font-bold py-2">{ product.title }</h2>
                    <p className="text-2xl font-bold py-2 border-b border-gray-400">₩{ product.price }</p>
                    <p className="py-4 text-lg">{ product.description }</p>
                    <div className="flex items-center">
                        <label htmlFor="select">옵션: </label>
                        <select
                            id='select'
                            className="p-2 m-4 flex-1 border-2 border-dashed border-brand outline-none"
                            onChange={ handleSelect }
                            value={ selected }
                        >
                            { product.options.map((option, index) => (
                                <option key={ index }>{ option }</option>
                            ))}
                        </select>
                    </div>
                    <Button 
                        text='장바구니에 추가'
                        onClick={ handleClick }
                    />
                </div>
            </section>
            <Comment product={product} />
        </>
    )
}