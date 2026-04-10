import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './app.css'
import Home from "./components/pages/Home";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Confirmation from "./components/pages/Confirmation";
import Details from "./components/pages/Details";
import Layout from "./components/Layout";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="confirmation" element={<Confirmation />} />
                    <Route path="product/:id" element={<Details />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
