import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { addNewComment, getCommentsByProductId } from '../api/firebase';
import { useAuthContext  } from '../context/AuthContext';
import CommentList from './CommentList';

export default function Comment({ product }) {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const { uid, user } = useAuthContext();

    const handleCommentSubmit = async () => {
        if (commentText.trim() !== '') {
            try {
                // 새 댓글 데이터 데이터베이스에 추가
                await addNewComment(commentText, uid, product.id, user.photoURL, user.displayName);
                
                const updatedComments = await getCommentsByProductId(product.id);

                // 댓글 등록 후 새롭게 댓글 리스트를 가져오게 함 (화면에 실시간 반영)
                // reverse: 댓글 최상단에 등록되게
                setComments(updatedComments.reverse());
                
                // 댓글 등록 후 댓글 박스 clear
                setCommentText('');
            
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    useEffect(() => {
        
        const fetchComments = async () => {

            try {
                const commentData = await getCommentsByProductId(product.id);
                setComments(commentData.reverse()); // 최신 댓글이 최상단에 보이게
            } catch(error) {
                console.error(error);
            }
        };

        fetchComments();

    }, [product .id]);

    return (
        <div className="comment-container">
            <div className="comment-input-container">
                {/* 댓글 작성 박스 */}
                <input
                    className="comment-input"
                    type="text"
                    placeholder="댓글을 입력하세요..."
                    value={commentText}
                    onChange={handleCommentChange}
                />
                {/* 댓글 등록 버튼 */}
                <Button text={ '등록' } className="comment-submit-button" onClick={handleCommentSubmit} />
            </div>
            <CommentList 
                comments={comments} 
            />
        </div>
    );
}
