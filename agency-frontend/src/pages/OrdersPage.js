import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // Стан для збереження замовлень
    const [loading, setLoading] = useState(true); // Стан для завантаження

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Не вдалося завантажити замовлення');
            const data = await response.json(); // Отримуємо дані з відповіді сервера
            setOrders(data); // Зберігаємо замовлення у стані
        } catch (error) {
            toast.error(error.message); // Виводимо помилку через Toastify
        } finally {
            setLoading(false); // Завершуємо завантаження
        }
    };

    useEffect(() => {
        fetchOrders(); // Викликаємо функцію завантаження замовлень під час завантаження сторінки
    }, []);

    return (
        <div className="container mt-5">
            <h2>Список замовлень</h2>
            {loading ? (
                <p>Завантаження...</p>
            ) : orders.length > 0 ? (
                <ul className="list-group">
                    {orders.map((order) => (
                        <li key={order.id} className="list-group-item">
                            <strong>{order.title}</strong>
                            <p>Опис: {order.description}</p>
                            <p>Дедлайн: {order.deadline}</p>
                            <p>
                                Виконавець:{' '}
                                {order.executor ? order.executor.fullName : 'Не призначено'}
                            </p>
                            <p>Статус: {order.status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Замовлення відсутні.</p>
            )}
        </div>
    );
};

export default OrdersPage;
