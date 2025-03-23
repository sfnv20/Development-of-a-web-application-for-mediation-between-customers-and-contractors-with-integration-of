import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const email = sessionStorage.getItem("authEmail") || ""; // Отримуємо email із sessionStorage

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Моя Платформа
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">
                                Реєстрація
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/create-order">
                                    Створити замовлення
                                </Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!isAuthenticated ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <img
                                        src="/user-icon.png"
                                        alt="Авторизація"
                                        style={{ width: "30px", cursor: "pointer" }}
                                    />
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text">Welcome {email}</span> {/* Відображаємо email */}
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-danger ms-2"
                                        onClick={logout}
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
