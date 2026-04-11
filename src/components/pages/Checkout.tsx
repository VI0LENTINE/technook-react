import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { getCart, getTotal } from "../../utils/cart";
import { useNavigate } from "react-router";

const stripePromise = loadStripe("pk_test_YOUR_KEY");

export default function Checkout() {
    const navigate = useNavigate();
    const cart = getCart();
    const total = getTotal();
    const [error, setError] = useState<string | null>(null);

    const fetchClientSecret = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    }))
                })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            return data.clientSecret;
        } catch (err) {
            console.error(err);
            setError("Failed to start checkout.");
            throw err;
        }
    }, [cart]);

    if (cart.length === 0) {
        return (
            <>
                <h1>Checkout</h1>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </>
        );
    }

    return (
        <>
            <h1>Checkout</h1>

            {error && <p>{error}</p>}

            <h2>Order Summary</h2>

            {cart.map(item => (
                <div key={item.id}>
                    <p>
                        {item.name} x {item.quantity} — $
                        {(item.price * item.quantity).toFixed(2)}
                    </p>
                </div>
            ))}

            <h3>Total: ${total.toFixed(2)}</h3>

            <hr />

            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </>
    );
}
