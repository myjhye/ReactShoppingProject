import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useState } from "react";
import { updateProduct } from "../api/firebase";

export default function EditMyProduct() {

    // 현재 경로의 state에서 제품 정보 가져옴
    const { state: { product } } = useLocation();

    // 수정된 제품정보 상태관리
    const [editedProduct, setEditedProduct] = useState(product);

    // 입력 값 변경 핸들러
    const handleChange = (e) => {
        
        // 사용자가 발생시킨 이벤트의 타겟 요소에서 값을 추출해 'value'와 'name' 변수에 저장
        const { value, name } = e.target;

        // 옵션 값이 변경되는 경우에 아래 코드 블록 실행
        if (name === "options") {

            // 현재 옵션 배열 복사 => 얕은 복사 => 수정된 데이터가 원본 데이터에도 영향 미침
            const updatedOptions = [...editedProduct.options]; 
            
            // 배열에서 선택한 옵션 값의 인덱스 찾기 (배열 몇 번째에 있는지 => 순서)
            const index = updatedOptions.indexOf(value);

            // 사용자가 이미 선택한 옵션을 다시 선택했을 경우
            if (index !== -1) {
                // 배열에서 해당 옵션 제거 => 선택 취소
                updatedOptions.splice(index, 1); 
            
            // 사용자가 미선택된 옵션을 선택했을 경우
            } else {
                // 배열에 선택한 옵션 추가
                updatedOptions.push(value); 
            }

            // 미리 정의된 순서에 따라 옵션 정렬
            const sortedOptions = ["XS", "S", "M", "L", "XL"].filter(option =>
                updatedOptions.includes(option)
            );

            // 수정된 옵션 배열로 제품 정보 업데이트
            setEditedProduct((prev) => ({
                ...prev,
                options: sortedOptions,
            }));

        } else {

            // 다른 입력 값들의 경우 해당 값을 업데이트
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
    const isOptionsSelected = editedProduct.options.length > 0;
    const isGenderSelected = editedProduct.gender.length > 0;
    const isCategorySelected = editedProduct.category.length > 0;

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
                    {/* 성별 */}
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

                {/* 옷 카테고리 */}
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

                {/* 사이즈 옵션 */}
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
                { isGenderSelected && isCategorySelected && isOptionsSelected ? (
                    <Button text={ '제품 수정하기' } />
                ) : (
                    <p className="text-red-500">모든 필수 선택 사항을 완료 해주세요</p>
                )}
            </form>
        </section>
    )
}