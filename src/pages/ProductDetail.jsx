import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { addOrUpdateToCart, getCart } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { formatAgo } from "../components/util/date";

export default function ProductDetail() {

    // 현재 페이지 컴포넌트에서 사용할 product 정보를 가져옴
    const { state: { product } } = useLocation();

    const { uid } = useAuthContext();
    
    // 선택된 옵션 -> 사이즈
    const [ selected, setSelected ] = useState(product.options[0]);

    
    

    
    //------------------- 장바구니


    // 사용자의 장바구니 정보 가져옴
    const { data: cartData } = useQuery(['carts'], () => getCart(uid));
    
    // 선택된 제품과 옵션이 장바구니에 이미 있는지 확인 -> some 사용 -> findIndex도 가능(isProductInCart !== -1)
    const isProductInCart = cartData
        ? cartData.some(item => item.id === product.id && item.option === selected)
        : false;


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
            <p className="mx-12 mt-4 text-gray-700">{ product.category } / { product.gender } - {formatAgo(product.date, 'ko')} 등록</p>
            <section className="flex flex-col md:flex-row p-4 mt-10">
                <img className="max-w-xl mx-auto px-4" src={product.image} alt={product.title} />
                <div className="w-full basis-5/12 flex flex-col p-4">
                    <h2 className="text-3xl font-bold py-2">{product.title}</h2>
                    <p className="text-2xl font-bold py-2 border-b border-gray-400">{`${product.price.toLocaleString()}원`}</p>
                    <p className="py-4 text-lg">{ product.description }</p>
                    <div className="flex items-center">
                        <label htmlFor="select">옵션: </label>
                        <select
                            id='select'
                            className="p-2 m-4 flex-1 border-2 border-dashed border-brand outline-none"
                            onChange={ (e) => setSelected(e.target.value) }
                            value={ selected }
                        >
                            {product.options.map((option, index) => (
                                <option key={index}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button 
                        text='장바구니에 추가'
                        onClick={handleClick}
                    />
                </div>
            </section>


    <hr className="mt-20" />

    {/* 댓글 */}
    <Comment
        product={product}
    />

    <div style={{ height: '400px' }}></div>
    </>
  );
}





