import { useLocation, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { addHelpComment, deleteHelpComment, getHelpCommentsByHelpId } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import HelpCommentEdit from "../components/HelpCommentEdit";
import HelpCommentInputBox from "../components/HelpCommentInputBox";

export default function ProductHelpDetail() {
  const { state: { helps } } = useLocation();
  const { uid, user } = useAuthContext();

  const [helpCommentText, setHelpCommentText] = useState('');
  const [helpCommentList, setHelpCommentList] = useState([]);
  const [editingHelpCommentId, setEditingCommentId] = useState(null);



  // 댓글 수정 버튼 클릭
  const handleEditButtonClick = (helpCommentId) => {
    setEditingCommentId(helpCommentId);
  }

  // 댓글 삭제 핸들러
  const handleDeleteHelpComment = async (helpCommentId) => {
      if (window.confirm('삭제하시겠습니까?')) {
          try {
              await deleteHelpComment(helpCommentId);

              // 댓글 목록 업데이트
              const updatedHelpComments = await getHelpCommentsByHelpId(helps.id);
              setHelpCommentList(updatedHelpComments.reverse());

          } catch (error) {
              console.error(error);
          }
      }

  };

  const handleHelpCommentSubmit = async () => {
    
    if (helpCommentText.trim() !== '') {
      
      try 
      {
        await addHelpComment(helps.id, helpCommentText, uid, user.photoURL, user.displayName);
        
        const updatedHelpComments = await getHelpCommentsByHelpId(helps.id);
        setHelpCommentList(updatedHelpComments.reverse());
        
        setHelpCommentText('');
        
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isCommentAllowed = () => {
    return user.isAdmin;
  }


  useEffect(() => {
    const fetchHelpComments = async () => {
      try 
      {
        const helpCommentData = await getHelpCommentsByHelpId(helps.id);
        setHelpCommentList(helpCommentData.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchHelpComments();
  }, [helps.id]);

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white p-4 rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-semibold mb-4">{helps.title}</h1>
        <p className="text-gray-600">{helps.date}</p>
        <hr className="my-4" />
        <p className="text-black">{helps.content}</p>

        {helps.imageUrl && (
                    <img className="max-w-xl mx-auto mt-10 md:ml-0" src={helps.imageUrl} alt={helps.title} />
                )}
      
      </div>

      {/* 댓글 입력 박스 */}
      <HelpCommentInputBox
        helpCommentText={helpCommentText}
        setHelpCommentText={setHelpCommentText}
        isCommentAllowed={isCommentAllowed}
        handleHelpCommentSubmit={handleHelpCommentSubmit}
      />

      {/* 댓글 목록 */}
      <div className="mt-5 space-y-4 w-full">
        {helpCommentList.map((helpComment, index) => (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4" key={index}>
            <div className="flex items-center space-x-2 mb-2 border-0">
              <img className="w-10 h-10 rounded-full mr-0" src={helpComment.userPhotoUrl} alt={helpComment.userName} />
              <p className="text-red-500">{helpComment.userName}</p>
              <p>{helpComment.date}</p>

              {helpComment.userId === uid && (
                <div className="ml-auto flex space-x-2">
                  <button onClick={() => handleEditButtonClick(helpComment.helpCommentId)} className="text-blue-500">수정</button>
                  <button onClick={() => handleDeleteHelpComment(helpComment.helpCommentId)} className="text-red-500">삭제</button>
                </div>
              )}
            </div>
            <div className="ml-12">
              <p>{helpComment.text}</p>

              {editingHelpCommentId === helpComment.helpCommentId && (
                <HelpCommentEdit
                  helpComment={helpComment}
                  helpCommentList={helpCommentList}
                  setHelpCommentList={setHelpCommentList}
                  setEditingCommentId={setEditingCommentId}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
