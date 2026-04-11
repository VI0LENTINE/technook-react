import { Link, Outlet } from "react-router";
import ChatWidget from "./ChatWidget";

export default function Layout() {
    return (
        <div className="container-fluid">
            <nav className="navbar px-3">
                <Link to="/" className="navbar-brand">
                    🍃 TechNook
                </Link>

                <Link to="/cart" className="text-decoration-none">
                    🛒 Cart
                </Link>
            </nav>

            <main className="container py-4">
                <Outlet />
            </main>

            <footer className="text-center py-4">
                &copy; 2026 TechNook
            </footer>

            <ChatWidget />
        </div>
    );
}