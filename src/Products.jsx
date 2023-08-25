import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";
import { useAuthContext } from "./context/AuthContext";

export default function Products() {

    const {
        isLoading,
        error,
        data: products
    } = useQuery(['products'], () => getProducts());

    const [sortedProducts, setSortedProducts] = useState(null);

    const handleSortByPrice = (order) => {
        let sorted;

        if (order === 'asc') {
            sorted = [...products].sort((a, b) => a.price - b.price);
        } else if (order === 'desc') {
            sorted = [...products].sort((a, b) => b.price - a.price);
        } else {
            sorted = [...products];
        }

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
        <>
            <Button text={ '가격 낮은 순' } onClick={ () => handleSortByPrice("asc") } />
            <Button text={ '가격 높은 순' } onClick={ () => handleSortByPrice("desc") } />
            <Button text={ '최신 순' } onClick={ () => handleSortByDate("latest") } />
            <Button text={ '오래된 순' } onClick={ () => handleSortByDate("oldest") } />
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
        </>
    )
}
