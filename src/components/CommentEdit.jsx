import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { updateComment } from "../api/firebase";

// 댓글 수정 박스
export default function CommentEdit({ comment, commentList, setCommentList, setEditingCommentId }) {
    
    // 수정 중인 댓글 텍스트
    const [editedText, setEditedText] = useState(comment.text);

    
    // 댓글 텍스트(comment.text) 변경 상태 업데이트
    useEffect(() => {
        
        // comment.text가 변경될 때마다 editedText 상태를 업데이트
        setEditedText(comment.text);

    }, [comment.text]);

    

    // 댓글 수정 저장 버튼 클릭 핸들러
    const handleSaveClick = async () => {

        // 서버에 댓글 업데이트 요청 => 수정한 내용을 서버에 저장
        await updateComment(comment.id, editedText);
    
        // 댓글 수정 후, 수정된 내용을 댓글 목록에 업데이트
        try {
            // 댓글 목록 순회하며 수정한 댓글을 찾아서 업데이트
            const updatedCommentList = commentList.map((c) => {
                if (c.id === comment.id) {
                    return { 
                        ...c,
                        // text를 editedText로 업데이트 
                        text: editedText 
                    }; 
                }
                return c;
            });
        
            setCommentList(updatedCommentList); // 업데이트된 댓글 목록을 상태에 저장
        } catch (error) {
            console.error(error); // 오류가 발생하면 콘솔에 출력
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
            <Button text={ '수정' } className="comment-submit-button" onClick={handleSaveClick} />
        </div>
    )
}