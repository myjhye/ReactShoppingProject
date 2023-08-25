import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useState } from "react";
import { updateProduct } from "../api/firebase";

export default function EditMyProduct() {

    const { state: { product } } = useLocation();
    const [file, setFile] = useState();
    const [editedProduct, setEditedProduct] = useState(product);
    const handleChange = (e) => {
       const { value, name } = e.target;

       setEditedProduct((prev) => ({
        ...prev,
        [name]: value
       }))
    }

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
                    name='category'
                    placeholder='카테고리'
                    value={ editedProduct.category }
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
                <input 
                    type='text'
                    name='options'
                    placeholder="옵션들 콤마(,)로 구분"
                    value={ editedProduct.options }
                    required
                    onChange={ handleChange }
                />
                <Button text={ '제품 수정하기' } />
            </form>
        </section>
    )
}