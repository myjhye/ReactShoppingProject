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
        gender: '',
        options: []
    });

    // 업로드할 이미지
    const [file, setFile] = useState();

    // 이미지 업로드 중 여부
    const [isUploading, setIsUploading] = useState(false);

    // 제품 등록 성공 여부
    const [success, setSuccess] = useState();
    
    // 사용자 인증 정보 훅에서 사용자 uid 가져옴
    const { uid } = useAuthContext();

    // 입력 값 변경 시 호출되는 함수
    const handleChange = (e) => {
        const { name, value, files, checked } = e.target;

        if(name === 'file') {
            // 선택한 이미지 파일 설정
            setFile(files && files[0]);
            return;
        }

        if (name === 'options') {
            
            // 선택된 옵션을 배열에 추가 또는 제거
            const updatedOptions = checked
                ? [...product.options, value]
                : product.options.filter(option => option !== value);
            
            // 옵션을 "XS", "S", "M", "L", "XL" 순서대로 정렬
            const sortedOptions = ["XS", "S", "M", "L", "XL"].filter(option => updatedOptions.includes(option));

            setProduct((product) => ({
                ...product,
                options: sortedOptions
            }));

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

    const isOptionsSelected = product.options.length > 0;
    const isGenderSelected = product.gender.length > 0;
    const isCategorySelected = product.category.length > 0;

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
                    name='description'
                    value={ product.description }
                    placeholder="제품 설명"
                    required
                    onChange={ handleChange }
                />
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="여성"
                            checked={product.gender.includes("여성")}
                            onChange={handleChange}
                        />
                        여성
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="남성"
                            checked={product.gender.includes("남성")}
                            onChange={handleChange}
                        />
                        남성
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="공용"
                            checked={product.gender.includes("공용")}
                            onChange={handleChange}
                        />
                        공용
                    </label>
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="상의"
                            checked={product.category.includes("상의")}
                            onChange={handleChange}
                        />
                        상의
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="하의"
                            checked={product.category.includes("하의")}
                            onChange={handleChange}
                        />
                        하의
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="원피스"
                            checked={product.category.includes("원피스")}
                            onChange={handleChange}
                        />
                        원피스
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="모자"
                            checked={product.category.includes("모자")}
                            onChange={handleChange}
                        />
                        모자
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="신발"
                            checked={product.category.includes("신발")}
                            onChange={handleChange}
                        />
                        신발
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="기타"
                            checked={product.category.includes("기타")}
                            onChange={handleChange}
                        />
                        기타
                    </label>
                </div>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="XS"
                            checked={product.options.includes("XS")}
                            onChange={handleChange}
                        />
                        XS
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="S"
                            checked={product.options.includes("S")}
                            onChange={handleChange}
                        />
                        S
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="M"
                            checked={product.options.includes("M")}
                            onChange={handleChange}
                        />
                        M
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="L"
                            checked={product.options.includes("L")}
                            onChange={handleChange}
                        />
                        L
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="XL"
                            checked={product.options.includes("XL")}
                            onChange={handleChange}
                        />
                        XL
                    </label>
                </div>
                { isGenderSelected && isCategorySelected && isOptionsSelected ? (
                    <Button 
                        text={ isUploading ? '업로드 중..' : '제품 등록하기' }
                        disabled={isUploading} 
                    />
                ) : (
                    <p className="text-red-500">모든 필수 선택 사항을 완료 해주세요</p>
                )}
            </form>
        </section>
    )
}