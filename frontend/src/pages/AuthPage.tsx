import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true); // Перемикання між входом і реєстрацією
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Поле "Ім'я" для реєстрації
    const [responseMessage, setResponseMessage] = useState(""); // Відповідь від сервера

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseMessage("");

        const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
        const payload = isLoginMode
            ? { email, password }
            : { email, password, name };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.text(); // Отримуємо текстову відповідь від сервера

            if (!response.ok) {
                throw new Error(data);
            }

            if (isLoginMode) {
                // Зберігаємо токен і ім'я користувача в куках після успішної авторизації
                Cookies.set("authToken", email, { expires: 7 }); // Термін дії токена — 7 днів
                Cookies.set("userName", data.split(",")[1], { expires: 7 }); // Ім'я користувача

                // Примусове оновлення сторінки для відображення кнопки "Вийти"
                window.location.href = "/";
            }

            setResponseMessage(data); // Відображаємо повідомлення від сервера
        } catch (error: any) {
            setResponseMessage(error.message); // Відображаємо помилку від сервера
        }
    };

    return (
        <div className="container mt-4">
            <h2>{isLoginMode ? "Вхід до системи" : "Реєстрація"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLoginMode && (
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Ім'я:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isLoginMode}
                        />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Пароль:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isLoginMode ? "Увійти" : "Зареєструватися"}
                </button>
            </form>
            {responseMessage && (
                <div className="alert alert-info mt-3">{responseMessage}</div>
            )}
            <div className="mt-3">
                {isLoginMode ? (
                    <>
                        Немає акаунта?{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0 m-0 border-0 text-decoration-none"
                            onClick={() => setIsLoginMode(false)}
                        >
                            Зареєструватися
                        </button>
                    </>
                ) : (
                    <>
                        Вже маєте акаунт?{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0 m-0 border-0 text-decoration-none"
                            onClick={() => setIsLoginMode(true)}
                        >
                            Увійти
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
