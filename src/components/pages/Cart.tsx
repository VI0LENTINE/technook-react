import { getCart, saveCart } from "../../utils/cart";
import type { CartItem } from "../../utils/cart";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>(getCart());

    const handleRemove = (id: number) => {
        const updated = cart.filter(item => item.id !== id);
        setCart(updated);
        saveCart(updated);
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemove(id);
            return;
        }

        const updated = cart.map(item =>
            item.id === id ? { ...item, quantity } : item
        );

        setCart(updated);
        saveCart(updated);
    };

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    if (cart.length === 0) {
        return (
            <>
                <h1>Cart</h1>
                <p>Your cart is empty.</p>
                <button onClick={() => navigate("/")}>
                    Continue Shopping
                </button>
            </>
        );
    }

    return (
        <>
            <h1>Cart</h1>

            {cart.map(item => (
                <div key={item.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>

                    <label>Quantity: </label>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                        }
                    />

                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>

                    <button onClick={() => handleRemove(item.id)}>
                        Remove
                    </button>
                </div>
            ))}

            <h2>Total: ${total.toFixed(2)}</h2>

            <button onClick={() => navigate("/checkout")}>
                Proceed to Checkout
            </button>
        </>
    );
}