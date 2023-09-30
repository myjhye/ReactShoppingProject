import { useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { useState } from "react";
import { addHelpComment } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function ProductHelpDetail() {
    const { state: { helps } } = useLocation();
    const { uid, user } = useAuthContext();

    // 문의 작성자와 운영자 여부를 판별하는 함수
    const isCommentAllowed = () => {

        // 운영자인 경우 댓글 작성 허용
        return user.isAdmin; // 예시로 isAdmin을 사용하여 운영자 여부를 판별
    };

    // 댓글 목록
    const [helpCommentList, setHelpCommentList] = useState([]);
    const [helpCommentText, setHelpCommentText] = useState('');

    // const handleHelpCommentSubmit = async () => {
    //     if (helpCommentText.trim() !== '' && isCommentAllowed()) {
    //         try {
    //             await addHelpComment(helpCommentText, uid, helps.id, user.photoURL, user.displayName);
    //             setHelpCommentText('');
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // };

    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold mb-4">{helps.title}</h1>
                <p className="text-gray-600">작성일: {helps.date}</p>
                <hr className="my-4" />
                <p className="text-black">{helps.content}</p>
                
                {helps.imageUrl && (
                    <img className="max-w-xl mx-auto px-4" src={helps.imageUrl} alt={helps.title} />
                )}

                {/* 댓글 목록 */}
                {/* 댓글 (문의 작성자와 운영자만 작성 가능) */}
                    <div className="comment-input-container">
                        {/* 댓글 작성 박스 */}
                        <input
                            className="comment-input"
                            type="text"
                            value={helpCommentText}
                            onChange={(e) => { setHelpCommentText(e.target.value) }}
                            placeholder={isCommentAllowed() ? "댓글을 입력하세요..." : "문의 작성자와 운영자만 작성할 수 있습니다"}
                            disabled={!isCommentAllowed()} // 댓글 허용 여부에 따라 입력란을 비활성화
                        />
                        {/* 댓글 등록 버튼 */}
                        <Button
                            text={'등록'}
                            className="comment-submit-button"
                            // onClick={handleHelpCommentSubmit}
                        />
                    </div>
            </div>
        </div>
    );
}
