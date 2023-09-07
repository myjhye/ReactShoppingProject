import { RiDeleteBin5Fill } from 'react-icons/ri';
import { removeMyProducts, removeProductAndCartData } from './api/firebase';
import { useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

export default function MyProducts({ product, onUpdate }) {

    // 상태 진행 중  상태
    const [isDeleting, setIsDeleting] = useState(false);

    const { uid } = useAuthContext();

    const handleDelete = async () => {

        const shouldDelete = window.confirm('정말로 상품을 삭제하시겠습니까?'); 

        if(shouldDelete) {
            // 삭제 진행 중 상태를 true로 설정해 삭제 중임을 나타냄
            setIsDeleting(true);

            // firebase에 상품 삭제 요청 보냄
            await removeProductAndCartData(uid, product.id);

            // 삭제 완료 후 상태를 false로 설정해 삭제 완료 나타냄
            setIsDeleting(false);

            // 삭제된 상품의 id를 콜백함수를 통해 상위 컴포넌트에 전달해 리스트 업데이트 요청
            onUpdate(product.id);
        }

    };

    const navigate = useNavigate();

    return (
        <li className="flex justify-between my-2 items-center">
            <img
                onClick={ () => { navigate(`/products/${ product.id }`, { state: { product }})} } 
                className="w-24 md:w-48 rounded-lg"
                src={product.image}
                alt={product.title}
            />
            <div className="flex-1 flex justify-between ml-4">
                <div className="basis-3/5">
                    <p className="text-lg">{product.title}</p>
                    <p className="text-xl font-bold text-brand">{product.option}</p>
                    <p>₩{product.price}</p>
                </div>
                <div className="text-2xl flex items-center">
                    
                <div 
                    onClick={ () => { navigate(`/edit/${ product.id }`, { state: { product }})} }
                    className="flex items-center cursor-pointer hover:text-brand"
                >
                    <BsFillPencilFill
                        className="transition-all hover:scale-105 mx-1"
                    />
                    수정
                </div>
                <div 
                    onClick={handleDelete} 
                    className="flex items-center cursor-pointer hover:text-brand"
                >
                    <RiDeleteBin5Fill
                        className="transition-all hover:scale-105 mx-1"
                    />
                    삭제
                </div>
                </div>
            </div>
        </li>
    )
}