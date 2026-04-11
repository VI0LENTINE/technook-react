import {Link, Outlet} from "react-router";
import ChatWidget from "./ChatWidget";

export default function Layout() {
    return(
        <div className="container-fluid">
            <header>
                <nav className="navbar navbar-light mb-4">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand fw-bold">
                            🍃 TechNook
                        </Link>

                        <div className="d-flex align-items-center gap-3">
                            <Link to="/cart" className="text-decoration-none text-dark fs-5">
                                🛒 Cart
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container-fluid py-4">
                <Outlet/>
            </main>

            <footer className="container-fluid mt-5 py-4 border-top">
                <div className="text-center text-muted">
                    <p>&copy; 2026 TechNook.</p>
                </div>
            </footer>

            <ChatWidget />
        </div>
    )
}
