import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api/firebase";
import ProductCard from "./components/ProductCard";
import Button from "./components/ui/Button";

export default function Products() {
    const { isLoading, error, data: products } = useQuery(['products'], () => getProducts());
    const [sortedProducts, setSortedProducts] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedGenderCategory, setSelectedGenderCategory] = useState(null);

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
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category === "전체" ? null : category);
    };

    const handleGenderCategorySelect = (genderCategory) => {
        setSelectedGenderCategory(genderCategory === "전체" ? null : genderCategory);
    };

    const mainCategories = ['전체', '원피스', '모자', '상의', '하의'];
    const genderCategories = ['전체', '여성', '남성', '공용'];

    const filteredProducts =
        (selectedCategory || selectedGenderCategory)
            ? (sortedProducts || products).filter(product => {
                const categoryMatch = !selectedCategory || product.category === selectedCategory;
                const genderCategoryMatch = !selectedGenderCategory || product.gender === selectedGenderCategory;
                return categoryMatch && genderCategoryMatch;
            })
            : sortedProducts || products;

    return (
        <div className="mt-4">
            <div className="mb-4 space-x-2">
                <Button text={'가격 낮은 순'} onClick={() => handleSortByPrice("asc")} />
                <Button text={'가격 높은 순'} onClick={() => handleSortByPrice("desc")} />
                <Button text={'최신 순'} onClick={() => handleSortByDate("latest")} />
                <Button text={'오래된 순'} onClick={() => handleSortByDate("oldest")} />
            </div>

            <div className="mb-4 space-x-2">
                {mainCategories.map(category => (
                    <label key={category} className="inline-flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category || (selectedCategory === null && category === '전체')}
                            onChange={() => handleCategorySelect(category)}
                            className="mr-1"
                        />
                        {category}
                    </label>
                ))}
            </div>

            <div className="mb-4 space-x-2">
                {genderCategories.map(genderCategory => (
                    <label key={genderCategory} className="inline-flex items-center">
                        <input
                            type="radio"
                            name="genderCategory"
                            value={genderCategory}
                            checked={
                                selectedGenderCategory === genderCategory ||
                                (selectedGenderCategory === null && genderCategory === '전체')
                            }
                            onChange={() => handleGenderCategorySelect(genderCategory)}
                            className="mr-1"
                        />
                        {genderCategory}
                    </label>
                ))}
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error.message}</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
