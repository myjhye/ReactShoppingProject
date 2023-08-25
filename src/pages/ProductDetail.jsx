import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { addOrUpdateToCart, getCart } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";

export default function ProductDetail() {

    const { uid } = useAuthContext();
    const { state: { product } } = useLocation();
    const [ selected, setSelected ] = useState(product.options[0]);
    const handleSelect = (e) => setSelected(e.target.value);
    const { data: cartData } = useQuery(['carts'], () => getCart(uid));
    const isProductInCart = cartData.some((item) =>
        item.id === product.id && item.option === selected
    );

    const handleClick = () => {

        if(isProductInCart) {
            alert('이미 장바구니에 추가된 상품입니다!');
        } else {
            alert('제품이 장바구니에 추가 되었습니다!');

            const products = {
                id: product.id,
                image: product.image,
                title: product.title,
                price: product.price,
                option: selected,
                quantity: 1
            };
            addOrUpdateToCart(uid, products);
        }
    }


    return (
        <>
            <p className="mx-12 mt-4 text-gray-700">{ product.category }</p>
            <section className="flex flex-col md:flex-row p-4">
                <img className="w-full px-4 basis-7/12" src={ product.image } alt={ product.title } />
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
        </>
    )
}