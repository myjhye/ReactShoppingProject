import { useLocation, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { addHelpComment } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";

export default function ProductHelpDetail() {
  const { state: { helps } } = useLocation();
  const { uid, user } = useAuthContext();

  const [helpCommentText, setHelpCommentText] = useState('');
  const [helpCommentList, setHelpCommentList] = useState([]);
  const [editingHelpCommentId, setEditingCommentId] = useState(null);

  const handleEditButtonClick = (commentId) => {
    setEditingCommentId(commentId);
  }

//   const handleDeleteHelpComment = async (helpCommentId) => {
//     if (window.confirm('삭제하시겠습니까?')) {
//       try {
//         await deleteHelpComment(helpCommentId);
//         const updatedHelpComments = await getHelpCommentsByHelpId(helps.id);
//         setHelpCommentList(updatedHelpComments.reverse());
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   }

  const handleHelpCommentSubmit = async () => {
    if (helpCommentText.trim() !== '') {
      try { 
        await addHelpComment(helps.id, helpCommentText, uid, user.photoURL, user.displayName);
        // const updatedHelpComments = await getHelpCommentsByHelpId(helps.id);
        // setHelpCommentList(updatedHelpComments.reverse());
        setHelpCommentText('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isCommentAllowed = () => {
    return user.isAdmin;
  }

//   useEffect(() => {
//     const fetchHelpComments = async () => {
//       try {
//         const helpCommentData = await getHelpCommentsByHelpId(helps.id);
//         setHelpCommentList(helpCommentData.reverse());
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchHelpComments();
//   }, [helps.id]);

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
      </div>

      {/* 댓글 목록 */}
      <div className="ml-8 space-y-4">
        {helpCommentList.map((helpComment, index) => (
          <div className="bg-white p-4 rounded-lg shadow-md" key={index}>
            <div className="flex items-center space-x-2 mb-2 border-0">
              <img className="w-10 h-10 rounded-full mr-0" src={helpComment.userPhotoUrl} alt={helpComment.userName} />
              <p className="text-red-500">{helpComment.userName}</p>
              <p>{helpComment.date}</p>

              {/* {helpComment.userId === uid && (
                <div className="ml-auto flex space-x-2">
                  <button onClick={() => handleEditButtonClick(helpComment.helpCommentId)} className="text-blue-500">수정</button>
                  <button onClick={() => handleDeleteHelpComment(helpComment.helpCommentId)} className="text-red-500">삭제</button>
                </div>
              )} */}
            </div>
            <div className="ml-8">
              <p>{helpComment.text}</p>

              {/* {editingHelpCommentId === helpComment.helpCommentId && (
                <HelpCommentEdit
                  helpComment={helpComment}
                  helpCommentList={helpCommentList}
                  setHelpCommentList={setHelpCommentList}
                  setEditingCommentId={setEditingCommentId}
                />
              )} */}
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 입력 창 */}
      <div className="comment-input-container mt-4">
        <input
          className="comment-input border rounded p-2 w-full"
          type="text"
          value={helpCommentText}
          onChange={(e) => { setHelpCommentText(e.target.value) }}
          placeholder={isCommentAllowed() ? "댓글을 입력하세요..." : "문의 작성자와 운영자만 작성할 수 있습니다"}
          disabled={!isCommentAllowed()}
        />
        <Button
          text={'등록'}
          className="comment-submit-button bg-blue-500 text-white px-4 py-2 ml-2 rounded cursor-pointer"
          onClick={handleHelpCommentSubmit}
        />
      </div>
    </div>
  );
}
