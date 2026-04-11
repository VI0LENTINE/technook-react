import {loadStripe} from "@stripe/stripe-js";
import {useCallback, useState} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import { getCart, getTotal } from "../../utils/cart";
import { useNavigate } from "react-router";

// Replace with your Stripe public key
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_YOUR_KEY_HERE";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function Checkout() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const cart = getCart();
    const total = getTotal();

    const fetchClientSecret = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    }))
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            return data.clientSecret;
        } catch (err) {
            console.error("Error fetching client secret:", err);
            setError("Failed to initialize checkout. Please try again.");
            throw err;
        }
    }, [cart]);

    if (cart.length === 0) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">
                    <h4>Your cart is empty</h4>
                    <p>Please add items to your cart before checking out.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <h1 className="display-5 mb-4">Secure Checkout</h1>

                    {error && (
                        <div className="alert alert-danger mb-4" role="alert">
                            <h4 className="alert-heading">Checkout Error</h4>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <EmbeddedCheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <hr />

                            {cart.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-2 small">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between mb-3">
                                <span className="fw-bold">Total:</span>
                                <span className="fw-bold text-primary h5">${total.toFixed(2)}</span>
                            </div>

                            <div className="alert alert-info small">
                                <strong>Test Card:</strong><br/>
                                4242 4242 4242 4242<br/>
                                Any future expiry date<br/>
                                Any CVC
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
