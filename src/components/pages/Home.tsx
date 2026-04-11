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
                setLoading(true);
                const res = await fetch("http://localhost:8080/products");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please ensure the backend server is running.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row mb-5">
                <div className="col-12">
                    <h1 className="display-4 fw-bold mb-2">🍃 TechNook</h1>
                    <p className="lead text-muted">Your cozy tech island shop!</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="alert alert-info">
                    <p>No products available at the moment.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {products.map((p: Product) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={p.id}>
                            <div className="card h-100 shadow-sm hover-card" style={{ transition: 'transform 0.2s' }}>
                                <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                                    <img
                                        src={p.imageUrl}
                                        className="card-img-top w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        alt={p.name}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold">{p.name}</h5>
                                    {p.description && (
                                        <p className="card-text text-muted small mb-3">{p.description.substring(0, 60)}...</p>
                                    )}
                                    <div className="mt-auto">
                                        <p className="h5 text-primary fw-bold mb-3">${p.price.toFixed(2)}</p>
                                        <Link
                                            to={`/product/${p.id}`}
                                            className="btn btn-primary w-100"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
