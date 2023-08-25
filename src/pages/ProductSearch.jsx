import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ProductCard from "../components/ProductCard";

export default function ProductSearch() {

    const { searchResults } = useAuthContext();

    return (
        <>
            <ul className="grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4">
                { searchResults.map((product) => (
                        <ProductCard 
                            key={ product.id }
                            product={ product }
                        />
                    ))}
            </ul>
        </>
    )
}