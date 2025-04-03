import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOrder from './pages/CreateOrder';
import OrdersPage from './pages/OrdersPage'; // Сторінка замовлень
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                {/* Сторінка входу */}
                <Route path="/login" element={<Login />} />
                {/* Сторінка реєстрації */}
                <Route path="/register" element={<Register />} />
                {/* Сторінка створення замовлення */}
                <Route path="/orders/create" element={<CreateOrder />} />
                {/* Сторінка списку замовлень */}
                <Route path="/orders" element={<OrdersPage />} />
            </Routes>
            {/* Контейнер для сповіщень Toastify */}
            <ToastContainer position="bottom-right" autoClose={3000} />
        </Router>
    );
};

export default App;
