import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { addToCart } from "../../utils/cart";

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
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

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

    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

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

            <div>
                <label>Quantity: </label>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
            </div>

            <br />

            <button onClick={handleAddToCart}>
                {added ? "✓ Added!" : "Add to Cart"}
            </button>

            <br /><br />

            <button onClick={() => navigate("/cart")}>
                Go to Cart
            </button>
        </>
    );
}
