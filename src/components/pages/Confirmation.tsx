import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router";
import { saveCart } from "../../utils/cart";

interface SessionData {
    status: string;
    customer_email: string;
}

export default function Confirmation() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessionStatus = async () => {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const sessionId = urlParams.get('session_id');

                if (!sessionId) {
                    setError("No session ID found");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`http://localhost:8080/checkout/session-status?session_id=${sessionId}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data: SessionData = await res.json();
                setStatus(data.status);
                setCustomerEmail(data.customer_email);

                // Clear cart on successful payment
                if (data.status === 'complete') {
                    saveCart([]);
                }
            } catch (err) {
                console.error("Error fetching session status:", err);
                setError("Failed to verify payment status");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionStatus();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Verifying payment status...</p>
            </div>
        );
    }

    if (status === 'open') {
        return (
            <Navigate to="/checkout" />
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
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

    if (status === 'complete') {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center py-5">
                                <div className="mb-4">
                                    <div className="display-1 text-success">
                                        ✓
                                    </div>
                                </div>

                                <h1 className="card-title display-5 fw-bold mb-3">
                                    Payment Successful!
                                </h1>

                                <p className="lead text-muted mb-4">
                                    Thank you for your purchase!
                                </p>

                                <div className="alert alert-info mb-4">
                                    <p className="mb-0">
                                        A confirmation email will be sent to <br/>
                                        <strong>{customerEmail}</strong>
                                    </p>
                                </div>

                                <div className="row g-3 mb-5">
                                    <div className="col-12">
                                        <div className="p-3 bg-light rounded">
                                            <p className="text-muted mb-1">Order Status</p>
                                            <p className="h5 mb-0">✓ Confirmed</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-muted mb-4">
                                    If you have any questions, please contact us at
                                    <br/>
                                    <a href="mailto:support@technook.com" className="text-decoration-none">
                                        support@technook.com
                                    </a>
                                </p>

                                <div className="d-flex gap-2 justify-content-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate("/")}
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate("/cart")}
                                    >
                                        View Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="alert alert-warning">
                <p>Unable to determine payment status. Please try again.</p>
            </div>
        </div>
    );
}
