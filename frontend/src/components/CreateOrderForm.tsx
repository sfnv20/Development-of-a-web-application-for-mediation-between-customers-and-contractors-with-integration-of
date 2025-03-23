import React, { useState } from 'react';
import api from '../api/api';

const CreateOrderForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '', // Дата у форматі yyyy-MM-dd
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/orders', formData);
            alert('Замовлення успішно створено!');
        } catch (error) {
            console.error('Помилка створення замовлення:', error);
            alert('Не вдалося створити замовлення');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Назва:</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Опис:</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Дедлайн:</label>
                <input
                    type="date" // Використовуємо HTML input type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                />
            </div>
            <button type="submit">Створити замовлення</button>
        </form>
    );
};

export default CreateOrderForm;
