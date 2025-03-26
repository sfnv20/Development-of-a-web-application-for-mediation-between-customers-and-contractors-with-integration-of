import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState(""); // Зберігаємо ім'я користувача
    const [userRole, setUserRole] = useState(""); // Зберігаємо роль користувача
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = Cookies.get("authToken");
        setIsAuthenticated(!!authToken); // Якщо токен існує, користувач авторизований

        if (authToken) {
            // Виконуємо запит до бекенду для отримання даних користувача
            fetch(`/api/auth/me?email=${authToken}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserName(data.name); // Встановлюємо ім'я користувача
                    setUserRole(data.type); // Встановлюємо роль користувача
                })
                .catch((error) => console.error("Помилка отримання даних користувача:", error));
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("authToken"); // Видаляємо токен із куків
        setIsAuthenticated(false); // Змінюємо стан авторизації
        setUserName(""); // Очищаємо ім'я користувача
        setUserRole(""); // Очищаємо роль користувача
        navigate("/auth"); // Перенаправляємо на сторінку авторизації
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Моя Платформа
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        {/* Вкладка "Створити замовлення" доступна лише для CLIENT і ADMIN */}
                        {(userRole === "CLIENT" || userRole === "ADMIN") && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/create-order">
                                    Створити замовлення
                                </Link>
                            </li>
                        )}
                        {(userRole === "EXECUTOR" || userRole === "ADMIN") && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">
                                    Список замовлень
                                </Link>
                            </li>
                        )}
                        {/* Вкладка "Адмін Панель" доступна лише для ADMIN */}
                        {userRole === "ADMIN" && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-panel">
                                    Адмін Панель
                                </Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/auth">
                                    Вхід / Реєстрація
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">
                                        Welcome, {userName}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleLogout}
                                    >
                                        Вийти
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
