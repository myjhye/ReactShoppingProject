import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { updateComment } from "../api/firebase";

// 댓글 수정 박스
// comment: 개별 댓글
// commentList: 댓글 목록
export default function CommentEdit({ comment, commentList, setCommentList, setEditingCommentId }) {
    
    // 수정 중인 댓글 내용
    const [editedText, setEditedText] = useState(comment.text);

    // 댓글 수정 창에 표시되는 내용이 원본 내용과 일치하게 표시 (초기) 
    useEffect(() => {
        setEditedText(comment.text);
    }, [comment.text]);

    // 댓글 수정 저장 버튼 클릭
    const handleSaveClick = async () => {

        // 댓글 수정
        await updateComment(comment.id, editedText);
    
        // 댓글 수정 후, 수정된 내용을 댓글 목록에 업데이트 (수정된 댓글 목록 화면 업데이트)
        try {
            // 댓글 목록 순회하며 수정한 댓글을 찾아서 업데이트
            const updatedCommentList = commentList.map((c) => {
                if (c.id === comment.id) {
                    return { 
                        ...c,
                        // 기존 댓글 내용을 수정된 내용(editedText)으로 변경
                        text: editedText 
                    }; 
                }
                // 수정된 댓글을 포함한 댓글 목록 반환
                return c;
            });
            // 수정된 댓글을 포함한 댓글 목록(업데이트된 댓글 목록)을 상태에 저장
            setCommentList(updatedCommentList);
        } catch (error) {
            console.error(error); 
        }
        // 댓글 수정 박스 닫기
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
            {/* 댓글 취소 버튼 */}
            <button className="comment-cancel-button" onClick={() => setEditingCommentId(null)}>
                취소
            </button>

            {/* 댓글 수정 저장 버튼 */}
            <Button 
                text={'수정'} 
                className="comment-submit-button" 
                onClick={handleSaveClick} 
            />
        </div>
    )
}