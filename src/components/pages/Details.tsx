import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:8080/products/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load product.");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <p>Loading product...</p>;
    }

    if (error || !product) {
        return (
            <>
                <p>{error || "Product not found."}</p>
                <button onClick={() => navigate("/")}>Back to Home</button>
            </>
        );
    }

    return (
        <>
            <button onClick={() => navigate("/")}>← Back</button>

            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h3>${product.price.toFixed(2)}</h3>

            <button disabled>
                Add to Cart (coming next)
            </button>
        </>
    );
}