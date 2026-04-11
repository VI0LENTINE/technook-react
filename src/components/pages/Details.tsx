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
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:8080/products/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details.");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error || "Product not found."}</p>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate("/")}
            >
                ← Back to Products
            </button>

            <div className="row g-5">
                <div className="col-12 col-md-6">
                    <div className="position-relative overflow-hidden rounded" style={{ height: '400px', backgroundColor: '#f8f9fa' }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

                    <div className="mb-4">
                        <p className="text-muted mb-2">Description</p>
                        <p className="lead">{product.description}</p>
                    </div>

                    <div className="mb-4">
                        <p className="text-muted mb-2">Price</p>
                        <p className="display-4 fw-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            className="form-control"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className={`btn ${addedToCart ? 'btn-success' : 'btn-primary'} btn-lg`}
                            onClick={handleAddToCart}
                        >
                            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                        <button
                            className="btn btn-outline-primary btn-lg"
                            onClick={() => navigate("/cart")}
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
