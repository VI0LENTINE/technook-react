import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_YOUR_KEY");

export default function Checkout() {
    const fetchClientSecret = useCallback(async () => {
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
        });
        const data = await res.json();
        return data.clientSecret;
    }, []);

    return (
        <>
            <h1>Checkout</h1>

            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </>
    );
}