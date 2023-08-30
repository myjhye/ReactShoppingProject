import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useState } from "react";
import { updateProduct } from "../api/firebase";

export default function EditMyProduct() {
    const { state: { product } } = useLocation();
    const [editedProduct, setEditedProduct] = useState(product);

    const handleChange = (e) => {
        const { value, name } = e.target;

        if (name === "options") {

            // 옵션을 복사해서 업데이트
            const updatedOptions = [...editedProduct.options]; 
            const index = updatedOptions.indexOf(value);

            if (index !== -1) {
                // 이미 선택된 경우 값 제거
                updatedOptions.splice(index, 1); 
            } else {
                // 선택되지 않은 경우 값 추가
                updatedOptions.push(value); 
            }

            // 미리 정의된 순서에 따라 옵션 정렬
            const sortedOptions = ["XS", "S", "M", "L", "XL"].filter(option =>
                updatedOptions.includes(option)
            );

            setEditedProduct((prev) => ({
                ...prev,
                options: sortedOptions,
            }));
        } else {
            setEditedProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        updateProduct(product.id, editedProduct)
            .then(() => {
                navigate('/uploaded');
                alert('성공적으로 제품이 수정되었습니다!')
            });
    }

    const navigate = useNavigate();

    return (
        <section className="w-full text-center">
            <h2 className="text-2xl font-bold my-4">등록한 제품 수정</h2>
            <img
                className="w-96 mx-auto mb-2"  
                src={editedProduct.image}
                alt='local file' 
            /> 
            <form
                className="flex flex-col px-12"
                onSubmit={ handleSubmit }  
            >
                <input 
                    type='text'
                    name='title'
                    placeholder="제품명"
                    value={ editedProduct.title }
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='number'
                    name='price'
                    placeholder="가격"
                    value={ editedProduct.price }
                    required
                    onChange={ handleChange }
                />
                <input 
                    type='text'
                    name='description'
                    placeholder="제품 설명"
                    value={ editedProduct.description }
                    required
                    onChange={ handleChange }
                />
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="여성"
                            checked={editedProduct.gender.includes("여성")}
                            onChange={handleChange}
                        />
                        여성
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="남성"
                            checked={editedProduct.gender.includes("남성")}
                            onChange={handleChange}
                        />
                        남성
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="gender"
                            value="공용"
                            checked={editedProduct.gender.includes("공용")}
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
                            checked={editedProduct.category.includes("상의")}
                            onChange={handleChange}
                        />
                        상의
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="하의"
                            checked={editedProduct.category.includes("하의")}
                            onChange={handleChange}
                        />
                        하의
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="원피스"
                            checked={editedProduct.category.includes("원피스")}
                            onChange={handleChange}
                        />
                        원피스
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="모자"
                            checked={editedProduct.category.includes("모자")}
                            onChange={handleChange}
                        />
                        모자
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="신발"
                            checked={editedProduct.category.includes("신발")}
                            onChange={handleChange}
                        />
                        신발
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="category"
                            value="기타"
                            checked={editedProduct.category.includes("기타")}
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
                            checked={editedProduct.options.includes("XS")}
                            onChange={handleChange}
                        />
                        XS
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="S"
                            checked={editedProduct.options.includes("S")}
                            onChange={handleChange}
                        />
                        S
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="M"
                            checked={editedProduct.options.includes("M")}
                            onChange={handleChange}
                        />
                        M
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="L"
                            checked={editedProduct.options.includes("L")}
                            onChange={handleChange}
                        />
                        L
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="options"
                            value="XL"
                            checked={editedProduct.options.includes("XL")}
                            onChange={handleChange}
                        />
                        XL
                    </label>
                </div>
                <Button text={ '제품 수정하기' } />
            </form>
        </section>
    )
}