import { Link, Outlet } from "react-router";

export default function Layout() {
    return (
        <div className="container-fluid">
            <header>
                <nav className="navbar mb-4">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand">
                            TechNook
                        </Link>

                        <Link to="/cart">Cart</Link>
                    </div>
                </nav>
            </header>

            <main className="container-fluid">
                <Outlet />
            </main>

            <footer className="container-fluid mt-5">
                TechNook, © 2026
            </footer>
        </div>
    );
}