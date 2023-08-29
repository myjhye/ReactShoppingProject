import React, { useState } from "react";
import Button from "../components/ui/Button";
import { uploadImage } from "../api/uploader";
import { addNewProduct } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function NewProduct() {

    const navigate = useNavigate();

    // 새 제품 정보 관리할 상태변수
    const [product, setProduct] = useState({
        title: "",
        price: "",
        category: "",
        description: "",
        options: ""
    });

    // 업로드할 이미지 파일 관리할 상태변수
    const [file, setFile] = useState();

    // 이미지 업로드 중 여부를 관리할 상태 변수
    const [isUploading, setIsUploading] = useState(false);

    // 제품 등록 성공 여부 관리할 상태 변수
    const [success, setSuccess] = useState();
    
    // 사용자 인증 정보 훅에서 사용자 uid 가져옴
    const { uid } = useAuthContext();

    // 입력 값 변경 시 호출되는 함수
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if(name === 'file') {
            // 선택한 이미지 파일 설정
            setFile(files && files[0]);
            return;
        }

        // 제품 정보 업데이트
        setProduct((product) => ({
            ...product,
            [name]: value // 해당 필드 값을 업데이트 해서 새 제품 정보 생성
        }));
        
    }


    // 제품 등록 폼 제출 시 호출되는 함수
    const handleSubmit = (e) => {

        e.preventDefault();

        // 이미지 업로드 중임을 표시
        setIsUploading(true);

        // 이미지 업로드 후 url을 받아와서 firebase에 제품 정보 추가
        uploadImage(file)
            .then(url => {
                console.log(url);
                addNewProduct(product, url, uid)
                    .then(() => {
                        navigate('/');
                        alert('성공적으로 제품이 추가되었습니다!')
                    });
            })
            .finally(() => setIsUploading(false));
    }

    return (
        <section className="w-full text-center">
            <h2 className="text-2xl font-bold my-4">새로운 제품 등록</h2>
            { success && <p className="my-2">{ success }</p>}

            { file && (
                <img
                    className="w-96 mx-auto mb-2"  
                    src={ URL.createObjectURL(file) } 
                    alt='local file' 
                /> 
            
            )}

            <form
                className="flex flex-col px-12"  
                onSubmit={ handleSubmit }
            >
                <input 
                    type="file"
                    accept="image/*"
                    name="file"
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='text'
                    name='title'
                    value={ product.title }
                    placeholder="제품명"
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='number'
                    name='price'
                    value={ product.price }
                    placeholder="가격"
                    required
                    onChange={ handleChange }
                />
                <input
                    type='text'
                    name='category'
                    value={product.category }
                    placeholder='카테고리'
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='text'
                    name='description'
                    value={ product.description }
                    placeholder="제품 설명"
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='text'
                    name='options'
                    value={ product.options }
                    placeholder="옵션들 콤마(,)로 구분"
                    required
                    onChange={ handleChange }
                />
                <Button 
                    text={ isUploading ? '업로드 중..' : '제품 등록하기' }
                    disabled={isUploading} 
                />
            </form>
        </section>
    )
}