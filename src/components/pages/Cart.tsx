import { getCart, saveCart } from "../../utils/cart";
import type { CartItem } from "../../utils/cart";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>(getCart());

    const handleRemoveItem = (id: number) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(id);
            return;
        }
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCart(updatedCart);
        saveCart(updatedCart);
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container py-4">
            <h1 className="display-4 mb-4">🛒 Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="alert alert-info py-5">
                    <h4>Your cart is empty</h4>
                    <p>Browse our collection and add some products to your cart.</p>
                    <Link to="/" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        className="rounded"
                                                    />
                                                    <Link
                                                        to={`/product/${item.id}`}
                                                        className="text-decoration-none"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    style={{ width: '70px' }}
                                                    min="1"
                                                    max="100"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                />
                                            </td>
                                            <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                            <div className="card-body">
                                <h5 className="card-title">Order Summary</h5>
                                <hr />

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-3">
                                    <span className="fw-bold h5">Total:</span>
                                    <span className="fw-bold h5 text-primary">${total.toFixed(2)}</span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn btn-primary w-100 mb-2"
                                >
                                    Proceed to Checkout
                                </Link>

                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => navigate("/")}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
