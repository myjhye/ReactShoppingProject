import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { getCommentsByProductId, updateComment } from "../api/firebase";

export default function CommentEdit({ comment, commentList, setCommentList, setEditingCommentId }) {
    
    const [editedText, setEditedText] = useState(comment.text);

    useEffect(() => {
        // comment.text가 변경될 때마다 editedText 상태를 업데이트
        setEditedText(comment.text);
    }, [comment.text]);

    const handleSaveClick = async () => {
        await updateComment(comment.id, editedText);
    
        try 
        {
            if (commentList) 
            {
                const updatedCommentList = commentList.map((c) => {
                    if (c.id === comment.id) 
                    {
                        return { 
                            ...c, 
                            text: editedText 
                        };
                    }
                    return c;
                });
    
                setCommentList(updatedCommentList);
            }

            comment.text = editedText;
            setEditedText(editedText);

        } catch (error) {
            console.error(error);
        }
    
        setEditingCommentId(null);
    }
    

    return (
        <div className="comment-input-container">
            {/* 댓글 작성 박스 */}
            <input
                className="comment-input"
                type="text"
                placeholder="댓글을 입력하세요..."
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
            />
            {/* 댓글 등록 버튼 */}
            <button className="comment-cancel-button" onClick={() => setEditingCommentId(null)}>
                취소
            </button>
            <Button text={ '수정' } className="comment-submit-button" onClick={handleSaveClick} />
        </div>
    )
}