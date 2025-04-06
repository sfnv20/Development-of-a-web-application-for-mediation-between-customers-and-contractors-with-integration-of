import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Викликаємо функцію виходу
        navigate('/'); // Перенаправляємо на головну сторінку
    };

    return (
        <header className="bg-dark text-white p-3">
            <nav className="container d-flex justify-content-between align-items-center">
                {/* Головна сторінка */}
                <Link to="/" className="text-white text-decoration-none">Головна</Link>

                {/* Вкладки для авторизованого користувача */}
                {user ? (
                    <>
                        <div className="d-flex align-items-center">
                            <Link to="/orders" className="text-white text-decoration-none me-3">Список замовлень</Link>
                            {(user.role === 'CLIENT' || user.role === 'ADMIN') && (
                                <Link to="/orders/create" className="text-white text-decoration-none me-3">Створити замовлення</Link>
                            )}
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="text-white text-decoration-none me-3">Адмін панель</Link>
                            )}
                        </div>

                        {/* Привітання та кнопка виходу */}
                        <div className="d-flex align-items-center">
                            <span className="me-3">Вітаємо, {user.fullName}!</span>
                            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Вийти</button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Вкладки для неавторизованого користувача */}
                        <div>
                            <Link to="/login" className="text-white text-decoration-none me-3">Вхід</Link>
                            <Link to="/register" className="text-white text-decoration-none">Реєстрація</Link>
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
