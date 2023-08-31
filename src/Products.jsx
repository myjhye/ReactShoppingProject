import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";

export default function Products() {

    const {
        isLoading,
        error,
        data: products
    } = useQuery(['products'], () => getProducts());
    // useQuery 훅으로 상품 데이터 가져오기


    // 상품 정렬 상태 관리
    const [sortedProducts, setSortedProducts] = useState(null);

    // 가격에 따른 상품 정렬
    const handleSortByPrice = (order) => {
        
        let sorted;

        // 가격 오름차순 정렬 
        if (order === 'asc') {
            sorted = [...products].sort((a, b) => a.price - b.price);
        
        // 가격 내림차순 정렬
        } else if (order === 'desc') {
            sorted = [...products].sort((a, b) => b.price - a.price);
        
        // 정렬하지 않음
        } else {
            sorted = [...products];
        }

        // 정렬된 상품을 상태로 설정 => 이로써 정렬된 상품 목록이 화면에 표시됨
        setSortedProducts(sorted);
    };

    const handleSortByDate = (order) => {
        
        let sorted;

        if (order === 'latest') {
            sorted = [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (order === 'oldest') {
            sorted = [...products].sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setSortedProducts(sorted);
    }

    return (
        <div className="mt-4">
            <div className="mb-4 space-x-2">
                <Button text={ '가격 낮은 순' } onClick={ () => handleSortByPrice("asc") } />
                <Button text={ '가격 높은 순' } onClick={ () => handleSortByPrice("desc") } />
                <Button text={ '최신 순' } onClick={ () => handleSortByDate("latest") } />
                <Button text={ '오래된 순' } onClick={ () => handleSortByDate("oldest") } />
            </div>
            { isLoading && <p>Loading..</p> }
            { error && { error } }
            <ul className="grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
                { (sortedProducts || products) &&
                    (sortedProducts || products).map((product) => (
                        <ProductCard 
                            key={ product.id }
                            product={ product }
                        />
                    ))}
            </ul>
        </div>
    )
}
