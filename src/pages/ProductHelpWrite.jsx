import { useState } from "react";
import { uploadImage } from "../api/uploader";
import Button from "../components/ui/Button";
import addHelpInquiry from "../api/firebase";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function ProductHelpWrite() {

    const [file, setFile] = useState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { uid } = useAuthContext();
    const navigate = useNavigate();
    const handleGoback = () => {
        navigate(-1);
    }

    const handleChange = (e) => {
        const { name, files } = e.target;

        if(name === 'file') {
            console.log('Selected File:', files[0]);
            setFile(files && files[0]);
            return;
        }
    }




    const handleSubmit = (e) => {

        e.preventDefault();

        // 이미지 업로드 중임을 표시
        setIsUploading(true);

        if(file) {
            // 이미지 업로드 후 url을 받아와서 firebase에 제품 정보 추가
            uploadImage(file)
                .then(url => {
                    console.log(url);
                    addHelpInquiry(title, content, url, uid)
                    navigate('/help');
                    alert('문의 사항이 작성 되었습니다')
                    setIsUploading(false);
                })
        } else {
            // 이미지 첨부가 없으면 바로 firebase에 제품 정보 추가
            addHelpInquiry(title, content, '', uid);
            navigate('/help');
            alert('문의 사항이 작성 되었습니다');
            setIsUploading(false);
        }
    };
    
    return ( 
        <div className="bg-gray-200 p-4">
        <Button text={ '뒤로' } onClick={handleGoback} />

        <h2 className="text-2xl font-semibold mb-4 mt-4">문의 사항 작성하기</h2>
            <form
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="flex flex-col"
            >
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full p-2 mb-4 bg-white rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-500"
                />

                <textarea
                    className="w-full h-40 p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-500"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                />

                <input
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={handleChange}
                    className="mb-4"
                />

                {file && (
                <>
                    <img
                        className="w-1/4"
                        src={URL.createObjectURL(file)}
                        alt="local file"
                    />
                    <br /> {/* 약간의 공백 */}
                </>
                )}

                <Button text={isUploading ? '업로드 중..' : '작성'} />
            </form>
        </div>
      )
}