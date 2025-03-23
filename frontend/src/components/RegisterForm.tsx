import React, { useState } from 'react';
import api from '../api/api';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        type: 'CLIENT',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            alert(response.data);
        } catch (error: any) {
            console.error('Помилка реєстрації:', error.response?.data || error.message);
            alert('Помилка реєстрації');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Пароль:</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Тип користувача:</label>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                    <option value="CLIENT">Замовник</option>
                    <option value="EXECUTOR">Виконавець</option>
                </select>
            </div>
            <button type="submit">Зареєструватися</button>
        </form>
    );
};

export default RegisterForm;
