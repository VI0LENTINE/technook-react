import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { saveCart } from "../../utils/cart";

interface SessionData {
    status: string;
    customer_email: string;
}

export default function Confirmation() {
    const navigate = useNavigate();

    const [status, setStatus] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const sessionId = params.get("session_id");

                if (!sessionId) {
                    setError("Missing session ID.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `http://localhost:8080/checkout/session-status?session_id=${sessionId}`
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data: SessionData = await res.json();

                setStatus(data.status);
                setEmail(data.customer_email);

                if (data.status === "complete") {
                    saveCart([]);
                }

            } catch (err) {
                console.error(err);
                setError("Failed to verify payment.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return <p>Verifying payment...</p>;
    }

    if (status === "open") {
        return <Navigate to="/checkout" />;
    }

    if (error) {
        return (
            <>
                <h1>Error</h1>
                <p>{error}</p>
                <button onClick={() => navigate("/")}>Back to Home</button>
            </>
        );
    }

    if (status === "complete") {
        return (
            <>
                <h1>Payment Successful!</h1>

                <p>
                    Thank you for your purchase.
                    A confirmation email has been sent to <strong>{email}</strong>.
                </p>

                <button onClick={() => navigate("/")}>
                    Continue Shopping
                </button>
            </>
        );
    }

    return <p>Unable to determine payment status.</p>;
}