import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateOrderPage from "./pages/CreateOrderPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage"; // Сторінка адміністратора
import Navbar from "./components/Navbar";
import { AuthProvider } from "./components/AuthProvider";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create-order" element={<CreateOrderPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/admin" element={<AdminPage />} /> {/* Маршрут для адміністратора */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
