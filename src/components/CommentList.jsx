import React, { useState, useEffect } from 'react';
import User from '../User/User';
import { useAuthContext } from '../context/AuthContext';
import { deleteComment, getCommentsByProductId } from '../api/firebase';
import Comment from './Comment';
import CommentEdit from './CommentEdit';

export default function CommentList({ comments }) {

    const { uid } = useAuthContext();
    const [commentList, setCommentList] = useState(comments);
    const [editingCommentId, setEditingCommentId] = useState(null);

    const handleDeleteComment = async (commentId, productId) => {
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteComment(commentId);

                const updatedComments = await getCommentsByProductId(productId);
                setCommentList(updatedComments.reverse());

            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEditButtonClick = (commentId) => {
        setEditingCommentId(commentId);
    };

    useEffect(() => {
        setCommentList(comments);
    }, [comments]);

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
                        {comment.userId === uid && (
                            <div className="ml-auto flex space-x-2">
                                <button onClick={() => handleEditButtonClick(comment.id)}>수정</button>
                                <button onClick={() => handleDeleteComment(comment.id, comment.productId)}>삭제</button>
                            </div>
                        )}
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
