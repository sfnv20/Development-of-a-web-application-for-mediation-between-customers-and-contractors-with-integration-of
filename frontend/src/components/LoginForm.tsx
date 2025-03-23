import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Надсилаємо запит на сервер для авторизації
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            const token = response.data.token;

            if (rememberMe) {
                // Зберігаємо токен у кукі
                Cookies.set("authToken", token, { expires: 7 }); // Термін дії: 7 днів
            } else {
                // Зберігаємо токен у sessionStorage
                sessionStorage.setItem("authToken", token);
            }

            alert("Вхід успішний!");
        } catch (err) {
            setError("Невірний email або пароль");
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
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Запам'ятати мене
                    </label>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
};

export default LoginForm;
