import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Header = () => {
    const { user, logout } = useContext(UserContext);

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
                            <Link to="/orders/create" className="text-white text-decoration-none me-3">Створити замовлення</Link>
                        </div>

                        {/* Привітання та кнопка виходу */}
                        <div className="d-flex align-items-center">
                            <span className="me-3">Вітаємо, {user.fullName}!</span>
                            <button className="btn btn-danger btn-sm" onClick={logout}>Вийти</button>
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
