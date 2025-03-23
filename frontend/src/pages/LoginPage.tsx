import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            const token = response.data.token; // Отримуємо токен із відповіді
            sessionStorage.setItem("authToken", token); // Зберігаємо токен у sessionStorage

            alert("Вхід успішний!");
            navigate("/"); // Перенаправляємо на головну сторінку
        } catch (err) {
            setError("Неправильний email або пароль");
        }
    };

    return (
        <div>
            <h1>Авторизація</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
};

export default LoginPage;
