import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });
            if (!response.ok) throw new Error(await response.text());

            // Успішна реєстрація
            toast.success('Реєстрація успішна! Очікуйте підтвердження адміністратора.');
            navigate('/login');
        } catch (error) {
            // Помилка реєстрації
            toast.error(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <h2 className="mb-4">Реєстрація</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Ім'я Прізвище"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-secondary w-100">Зареєструватися</button>
            </form>
        </div>
    );
};

export default Register;
