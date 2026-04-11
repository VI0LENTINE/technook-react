export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

const CART_KEY = "cart";

export function getCart(): CartItem[] {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: any) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);

    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    saveCart(cart);
}

export function getTotal(): number {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}
