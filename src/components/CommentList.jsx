import React, { useState, useEffect } from 'react';
import { LuThumbsUp, LuThumbsDown } from 'react-icons/lu';
import { MdThumbUp, MdThumbDown } from 'react-icons/md';
import { useAuthContext } from '../context/AuthContext';
import { deleteComment, dislikeComment, getCommentsByProductId, getLikedUsers, likeComment, unlikeComment } from '../api/firebase';
import CommentEdit from './CommentEdit';
import { useQuery } from '@tanstack/react-query';

// 댓글 목록
export default function CommentList({ comments, product }) {

    const { uid } = useAuthContext();

    // 댓글 목록
    const [commentList, setCommentList] = useState(comments);
    
    // 수정 중인 댓글 id
    const [editingCommentId, setEditingCommentId] = useState(null);

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId, productId) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteComment(commentId);

                // 댓글 목록 업데이트
                const updatedComments = await getCommentsByProductId(productId);
                setCommentList(updatedComments.reverse());

            } catch (error) {
                console.error(error);
            }
        }

    };


    // 댓글 수정 핸들러
    const handleEditButtonClick = (commentId) => {
        setEditingCommentId(commentId);
    };


    
    // 댓글 좋아요 핸들러
    const handleLikeButtonClick = async (commentId, productId) => {

            // 좋아요 증가 함수 호출
            await likeComment(commentId, uid);

            // 좋아요 수가 업데이트된 댓글 목록 가져오기
            const updatedComments = await getCommentsByProductId(productId);
            setCommentList(updatedComments.reverse());

    }



    //댓글 싫어요 핸들러
    const handlDislikeButtonClick = async (commentId, productId) => {

            // 싫어요 증가 함수 호출
            await dislikeComment(commentId, uid);

            // 싫어요 수가 업데이트된 댓글 목록 가져오기
            const updatedComments = await getCommentsByProductId(productId);
            setCommentList(updatedComments.reverse());

    }

    // 댓글 목록이 변경 될 때마다(새 댓글이 입력 될 때마다) 댓글 목록 업데이트
    useEffect(() => {
        setCommentList(comments);
    }, [comments]);



    //const likesCount = likesData.length;



    


    return (
        <div className="comment-list">
            {commentList.map((comment, index) => (
                <div className="comment-item" key={index}>
                    <div className="comment-item flex items-center space-x-2 mb-2 border-0">
                        <img
                            className="w-10 h-10 rounded-full mr-0" 
                            src={comment.userPhotoUrl} 
                        />
                        <p style={{ color: '#F96162' }}>{comment.userName}</p>
                        <p>{comment.date}</p>

                        {/* 댓글 작성자 id === 접속한 사용자 id (댓글 작성자가 본인일 때) */}
                        {comment.userId === uid && (
                            <div className="ml-auto flex space-x-2">
                                <button onClick={() => handleEditButtonClick(comment.id)}>수정</button>
                                <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                            </div>
                        )}

                        <button onClick={() => handleLikeButtonClick(comment.id, comment.productId)}>
                           <LuThumbsUp />
                        </button>
                            { comment.likes }

                        { <button onClick={() => handlDislikeButtonClick(comment.id, comment.productId)}>
                            <LuThumbsDown />
                        </button> }
                            { comment.dislikes }
                    </div>

                    <div className="ml-8">
                        <p>{comment.text}</p> {/* 기존 댓글 텍스트 */}
                        {editingCommentId === comment.id && (
                            <CommentEdit 
                                comment={comment}
                                commentList={commentList}
                                setCommentList={setCommentList} 
                                setEditingCommentId={setEditingCommentId} 
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
