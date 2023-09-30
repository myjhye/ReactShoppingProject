import HelpCommentEdit from "./HelpCommentEdit";

export default function HelpCommentList({
    helpCommentList, 
    uid, 
    handleEditButtonClick,
    handleDeleteHelpComment,
    editingHelpCommentId,
    setHelpCommentList,
    setEditingCommentId,
}) {

    return (
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
    )
}