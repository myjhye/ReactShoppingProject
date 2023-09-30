import Button from "./ui/Button"

export default function HelpCommentInputBox({helpCommentText, setHelpCommentText, isCommentAllowed, handleHelpCommentSubmit}) {

    return (
        <div className="comment-input-container ml-0 mt-4 w-full">
            <input
                className="comment-input border rounded p-2 w-full"
                type="text"
                value={helpCommentText}
                onChange={(e) => { setHelpCommentText(e.target.value) }}
                placeholder={isCommentAllowed() ? "댓글을 입력하세요..." : "운영자만 작성할 수 있습니다"}
                disabled={!isCommentAllowed()}
            />
            <Button
                text={'등록'}
                className="comment-submit-button bg-blue-500 text-white px-4 py-2 ml-2 rounded cursor-pointer"
                onClick={handleHelpCommentSubmit}
            />
        </div>
    )
}