import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import OrderListPage from "./pages/OrderListPage";

const App = () => {
    return (
        <Router>
            {/* Панель навігації */}
            <Navbar />

            {/* Основний контент */}
            <div className="container mt-4">
                <Routes>
                    {/* Головна сторінка */}
                    <Route path="/" element={<h1>Головна сторінка</h1>} />

                    {/* Сторінка авторизації/реєстрації */}
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Сторінка створення замовлення */}
                    <Route path="/create-order" element={<CreateOrderPage />} />

                    {/* Сторінка адмін панелі */}
                    <Route path="/admin-panel" element={<AdminPanelPage />} />

                    {/* Сторінка списку замовлень */}
                    <Route path="/orders" element={<OrderListPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
