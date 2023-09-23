import { useQuery } from "@tanstack/react-query";
import { getHelpInquiry } from "../api/firebase";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ProductHelp() {

    const { isLoading, error, data: help } = useQuery(['help'], () => getHelpInquiry());
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/help/new');
    }

    return ( 
        <div className="bg-gray-200 p-4">
            <Button
                text={'문의 작성'} 
                className="hover:underline hover:text-blue-500 text-black"
                onClick={handleButtonClick}
                
            />

            <div className="my-4"></div>
            
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">고객 게시판</h2>
          </div>
          <br /> {/* 약간의 공백 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading && <p>Loading...</p>}
                {!isLoading && (help && help.length > 0) ? (
                    help.map((helps) => (
                        <div
                            key={helps.id}
                            className="bg-white p-4 rounded-lg shadow-md"
                        >
                            <h3 className="text-xl font-semibold truncate">
                                {helps.title}
                            </h3>
                            <p className="text-gray-600">{helps.date}</p>
                            <br />
                            <p className="text-black truncate">{helps.content}</p>
                        </div>
                    ))
                ) : (
                <p>작성된 문의 사항이 없습니다</p>
            )}
          </div>
        </div>
      );
};