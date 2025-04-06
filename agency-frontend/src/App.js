import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateOrder from './pages/CreateOrder';
import OrdersPage from './pages/OrdersPage';
import AdminPanel from './pages/AdminPanel'; // Адмін-панель
import HomePage from './pages/HomePage'; // Головна сторінка
import OrderDetails from './pages/OrderDetails';
import { UserContext } from './UserContext';
import { ToastContainer } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/login" />; // Перенаправляємо на сторінку входу, якщо користувач не авторизований
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Перенаправляємо на головну сторінку, якщо роль не дозволена
    }

    return children;
};

const App = () => (
    <Router>
        <Header />
        <Routes>
            {/* Головна сторінка */}
            <Route path="/" element={<HomePage />} />
            {/* Сторінка входу */}
            <Route path="/login" element={<Login />} />
            {/* Сторінка реєстрації */}
            <Route path="/register" element={<Register />} />
            {/* Сторінка створення замовлення */}
            <Route
                path="/orders/create"
                element={
                    <ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']}>
                        <CreateOrder />
                    </ProtectedRoute>
                }
            />
            {/* Сторінка списку замовлень */}
            <Route path="/orders" element={<OrdersPage />} />
            {/* Деталі замовлення */}
            <Route path="/orders/:id" element={<OrderDetails />} />
            {/* Адмін-панель */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
        </Routes>
        {/* Контейнер для сповіщень Toastify */}
        <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
);

export default App;
