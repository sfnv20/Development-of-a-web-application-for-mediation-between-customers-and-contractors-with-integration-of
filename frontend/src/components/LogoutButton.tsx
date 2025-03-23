import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Видаляємо токен з sessionStorage та кукі
        sessionStorage.removeItem("authToken");
        Cookies.remove("authToken");

        alert("Ви вийшли з аккаунта!");
        navigate("/login"); // Перенаправляємо на сторінку авторизації після виходу
    };

    return (
        <button onClick={handleLogout}>Вийти</button>
    );
};

export default LogoutButton;
