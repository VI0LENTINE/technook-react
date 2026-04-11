import { useEffect, useState } from "react";
import { Link } from "react-router";

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description?: string;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8080/products");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load products.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <h1>Products</h1>

            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                    {products.map((p) => (
                        <div key={p.id} style={{ border: "1px solid #ccc", padding: "1rem" }}>
                            <h3>{p.name}</h3>
                            <p>${p.price.toFixed(2)}</p>

                            <Link to={`/product/${p.id}`}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}