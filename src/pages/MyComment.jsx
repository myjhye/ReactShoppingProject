import React, { useEffect, useState } from "react"; 
import { useAuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { deleteComment, getMyCommentsWithProductData } from "../api/firebase"; // 수정된 함수를 가져옵니다.
import { useNavigate } from "react-router-dom";
import { GoLinkExternal } from 'react-icons/go';

export default function MyComment() {
    const { uid } = useAuthContext();
    const { data: myCommentsWithProductTitles, refetch } = useQuery(['commentsWithProductTitles', uid], () => getMyCommentsWithProductData(uid)); 

    const hasProducts = myCommentsWithProductTitles && myCommentsWithProductTitles.length > 0;
    const navigate = useNavigate();

    // 선택한 댓글
    const [selectedComments, setSelectedComments] = useState([]);



    // '전체선택' 버튼 클릭 핸들러
    const selectAllComments = () => {

        if (selectedComments.length === myCommentsWithProductTitles.length) {
            setSelectedComments([]);
        } else {
            const allCommentIds = myCommentsWithProductTitles.map(comment => comment.id);
            setSelectedComments(allCommentIds);
        }
    }



    // 댓글 선택 토글
    const toggleCommentSelection = (commentId) => {
        
        if (selectedComments.includes(commentId)) {
            setSelectedComments(selectedComments.filter(id => id !== commentId)); 
        } else {
            setSelectedComments([
                ...selectedComments,
                commentId,
            ]);
        }
    }


    // 댓글 삭제
    const deleteSelectedComments = async () => {
    
        if(window.confirm('삭제하시겠습니까?')) {
            try {
                for (const commentId of selectedComments) {
                    await deleteComment(commentId);
                }
                refetch();
                setSelectedComments([]);
            
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <section className="p-8 flex flex-col">
            <p className="text-2xl text-center font-bold pb-4 border-b border-gray-300">내가 등록한 댓글</p>
            
            <div className="flex border-b border-gray-300">
                <button onClick={() => navigate('/myProduct')} className="mr-3 mb-2 mt-2 hover:text-blue-500">내가 등록한 상품</button>
                <button onClick={() => navigate('/myComment')} className="mb-2 mt-2 hover:text-blue-500">내가 등록한 댓글</button>
            </div>
            
            {!hasProducts && <p>작성한 댓글이 없습니다!</p>}
            {hasProducts && (
                <ul className="border-b border-gray-300 mb-8 p-4 px-8">
                    <button
                        className="mr-3 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
                        onClick={selectAllComments}
                    >
                        전체선택
                    </button>
                    <button
                        className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
                        onClick={deleteSelectedComments}
                    >
                        삭제
                    </button>

                    {myCommentsWithProductTitles && myCommentsWithProductTitles.map((comment) => (
                        <div key={comment.id}>
                            <hr className="mt-3" />
                            <div className="flex mt-5">
                                <input 
                                    type='checkbox'
                                    checked={selectedComments.includes(comment.id)}
                                    onChange={() => toggleCommentSelection(comment.id)}
                                    className="mr-1" 
                                />
                                <li className="mr-2 text-blue-500 text-sm">{comment.userName}</li>
                                <li className="text-gray-500 text-sm">{comment.date}</li>
                            </div>
                            <li>{comment.text}</li>
                            <div className="flex mt-4">
                                <GoLinkExternal className="mr-1" />
                                <li
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => navigate(`/products/${comment.productId}`, { state: { product: comment.productData } })}
                                >
                                    {comment.productData.title}
                                </li>
                            </div>
                        </div>
                    ))}
                </ul>
            )}
        </section>
    )
}
