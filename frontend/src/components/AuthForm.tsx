import React, { useState } from "react";
import Cookies from "js-cookie";

const AuthForm = () => {
    const [isLoginMode, setIsLoginMode] = useState(true); // Перемикання між входом і реєстрацією
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "", // Поле "Ім'я" для реєстрації
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    ...(isLoginMode ? {} : { name: formData.name }), // Додаємо поле "Ім'я" тільки для реєстрації
                }),
            });

            if (!response.ok) {
                throw new Error("Помилка авторизації/реєстрації.");
            }

            const data = await response.json();
            alert(isLoginMode ? "Вхід успішний!" : "Реєстрація успішна!");
        } catch (error) {
            console.error(error);
            alert("Сталася помилка.");
        }
    };


    return (
        <div className="auth-form">
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
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
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
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
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
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isLoginMode ? "Увійти" : "Зареєструватися"}
                </button>
            </form>
            <div className="mt-3">
                {isLoginMode ? (
                    <>
                        Немає акаунта?{" "}
                        <button
                            onClick={() => setIsLoginMode(false)}
                            type="button"
                            className="btn btn-link p-0 m-0 border-0 text-decoration-none"
                        >
                            Зареєструватися
                        </button>
                    </>
                ) : (
                    <>
                        Вже маєте акаунт?{" "}
                        <button
                            onClick={() => setIsLoginMode(true)}
                            type="button"
                            className="btn btn-link p-0 m-0 border-0 text-decoration-none"
                        >
                            Увійти
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
