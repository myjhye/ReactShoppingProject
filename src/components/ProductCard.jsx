import React from "react";
import { useNavigate } from "react-router-dom";
import { formatAgo } from "./util/date";
import { AiOutlineMessage } from 'react-icons/ai';
import { TbSquareLetterN } from 'react-icons/tb';
import moment from "moment";

export default function ProductCard({ product }) {

    const navigate = useNavigate();

    // 제품 등록일부터 현재 날짜와의 일(day) 차이 계산 -> 1일 미만이면 isOverThreeDays를 true로
    const isOverThreeDays = moment().diff(moment(product.date), 'days') < 1;




    return (

        // 제품 카드 클릭 시 해당 제품 상세 페이지로 이동하는 이벤트 핸들러 설정
        <li
            onClick={() => { navigate(`/products/${product.id}`, { state: { product } }) }}
            className="rounded-lg shadow-md overflow-hidden cursor-pointer"
        >

            {/* 제품 이미지 */}
            <img className='w-full' src={product.image} alt={product.title} />
            
            
            <div className="mt-2 px-2 text-lg justify-between items-center">
                <div className="flex">

                    {/* 제품 제목 */}
                    <h3 className="truncate">{product.title}</h3>
                        
                        {/* isOverThreeDays가 true면 N 아이콘 */}
                        {isOverThreeDays && (
                            <div class="text-red-500">
                                <TbSquareLetterN />
                            </div>
                        )}   
                </div>

                <br />

                {/* 제품 가격 */}
                <p class="text-lg font-bold">{`${product.price.toLocaleString()}원`}</p>
            </div>

            {/* 제품 카테고리 & 성별 */}
            <p className="mb-2 px-2 text-gray-600">{product.category} / {product.gender}</p>
            <div className="mt-2 px-2 text-lg flex justify-between items-center">
                
                {/* 제품 등록일 */}
                <p className="mb-2 px-2 text-gray-600">{formatAgo(product.date, 'ko')}</p>
                
                {/* 댓글 수 (추후 구현) */}
                <p>
                    <AiOutlineMessage />
                </p>
            </div>
        </li>
    )
}