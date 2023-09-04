import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { addBookmark, addOrUpdateToCart, getBookmarks, getCart, removeBookmark } from "../api/firebase";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import DefaultButton from "../components/ui/DefaultButton";

export default function ProductDetail() {

    // context에서 사용자 uid 가져옴
    const { uid } = useAuthContext();

    // 현재 페이지 컴포넌트에서 사용할 product 정보를 가져옴
    const { state: { product } } = useLocation();
    
    // 선택된 옵션
    const [ selected, setSelected ] = useState(product.options[0]);
    
    // 옵션 선택 핸들러
    const handleSelect = (e) => setSelected(e.target.value);





    
    ////////////// 장바구니


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





    ////////////// 북마크


    // 특정 상품 북마크 데이터 가져옴
    const { data: bookmarksData } = useQuery(['bookmarks'], () => getBookmarks(product.id));

    

    
    
    // 현재 사용자가 해당 상품을 북마크한 상태인지 확인 => 조건을 만족하는 북마크 데이터가 하나 이상 있으면 isUserBookmarked는 true로 설정됨
    const isUserBookmarked = bookmarksData && Object.values(bookmarksData).some(bookmark => {
        return bookmark.uid === uid;
      });
      
    
    // 상품 북마크 클릭 핸들러
    const handleBookmarkClick = async () => {

        if (isUserBookmarked) {
            
            await removeBookmark(product.id, uid);
            
            alert('북마크가 삭제되었습니다');
        } else {
            const products = {
                id: product.id,
                image: product.image,
                title: product.title,
                price: product.price,
                option: selected,
                uid: uid
            };

            // 북마크에 제품 추가
            addBookmark(uid, products);

            //console.log(JSON.stringify(bookmarksData, null, 2));
            //console.log(bookmarksData[product.id][uid].id);

            alert('북마크가 추가되었습니다');
        }
    }


    // 북마크가 클릭된 상태면 <FaBookmark /> 사용, 아니면 <FaRegBookmark /> 사용
    const bookmarkIcon = isUserBookmarked ? <FaBookmark /> : <FaRegBookmark />;
    const buttonText = (
        <span className="flex items-center justify-center">
            {bookmarkIcon}
            <span className="ml-2">{bookmarksData ? bookmarksData.length : 0}</span>
            <span className="ml-2">관심상품</span>
        </span>
    );
    


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
                                <option key={ index }>
                                    { option }
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button 
                        text='장바구니에 추가'
                        onClick={ handleClick }
                    />

                    <div>
                        <DefaultButton 
                            text={buttonText}
                            onClick={handleBookmarkClick}
                        />
                    </div>
                </div>
            </section>
            <Comment product={product} />
        </>
    )
}