import { useLocation, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import { addHelpComment, deleteHelpComment, getHelpCommentsByHelpId } from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import HelpCommentEdit from "../components/HelpCommentEdit";
import HelpCommentInputBox from "../components/HelpCommentInputBox";
import HelpCommentList from "../components/HelpCommentList";

export default function ProductHelpDetail() {
  const { state: { helps } } = useLocation();
  const { uid, user } = useAuthContext();

  const [helpCommentText, setHelpCommentText] = useState('');
  const [helpCommentList, setHelpCommentList] = useState([]);
  const [editingHelpCommentId, setEditingCommentId] = useState(null);

   // 댓글 있는 지 여부
   const [hasComments, setHasComments] = useState(false);


   const checkComments = async (helpId) => {

    try {
          const comments = await getHelpCommentsByHelpId(helpId);
          setHasComments(comments.length > 0);
    } catch (error) {
        console.log(error);
    }
  };


  useEffect(() => {
      checkComments(helps.id);
  }, [helps]);



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
        
        {/* 답변 등록 여부 */}
        {!hasComments && <p className="text-red-600">답변 미등록</p>}
        {hasComments && <p className="text-green-600">답변 등록됨</p>}

        <h1 className="text-3xl font-semibold mt-4">{helps.title}</h1>
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
      <HelpCommentList 
        helpCommentList={helpCommentList}
        uid={uid}
        handleEditButtonClick={handleEditButtonClick}
        handleDeleteHelpComment={handleDeleteHelpComment}
        editingHelpCommentId={editingHelpCommentId}
        setHelpCommentList={setHelpCommentList}
        setEditingCommentId={setEditingCommentId}
      />
    </div>
  );
}
