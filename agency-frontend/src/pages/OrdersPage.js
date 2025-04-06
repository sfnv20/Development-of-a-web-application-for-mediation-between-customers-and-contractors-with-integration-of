import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const { user } = useContext(UserContext); // Отримуємо дані користувача з контексту
    const [orders, setOrders] = useState([]); // Стан для замовлень
    const [loading, setLoading] = useState(true); // Стан для завантаження
    const navigate = useNavigate(); // Для перенаправлення

    useEffect(() => {
        if (!user) {
            navigate('/'); // Перенаправляємо на головну сторінку, якщо користувач не авторизований
            return;
        }

        const fetchOrders = async () => {
            try {
                let endpoint;

                // Визначаємо endpoint залежно від ролі користувача
                if (user.role === 'CLIENT') {
                    endpoint = `/api/orders/client/${user.id}`;
                } else if (user.role === 'EXECUTOR') {
                    endpoint = `/api/orders/executor/${user.id}`;
                } else if (user.role === 'ADMIN') {
                    endpoint = `/api/orders`; // Адміністратор бачить всі замовлення
                } else {
                    throw new Error('Ваша роль не підтримується для цієї сторінки');
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Не вдалося завантажити замовлення');
                const data = await response.json();
                setOrders(data); // Зберігаємо замовлення у стані
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false); // Завершуємо завантаження
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null; // Нічого не рендеримо, якщо користувач не авторизований

    if (loading) return <div className="container mt-5">Завантаження замовлень...</div>;

    return (
        <div className="container mt-5">
            <h2>
                {user.role === 'CLIENT'
                    ? 'Мої замовлення'
                    : user.role === 'EXECUTOR'
                        ? 'Призначені замовлення'
                        : 'Всі замовлення'}
            </h2>
            {orders.length > 0 ? (
                <ul className="list-group">
                    {orders.map((order) => (
                        <li key={order.id} className="list-group-item">
                            <strong>{order.title}</strong>
                            <p>Опис: {order.description}</p>
                            <p>Дедлайн: {order.deadline}</p>
                            {user.role === 'CLIENT' && (
                                <p>Виконавець: {order.executor ? order.executor.fullName : 'Не призначено'}</p>
                            )}
                            {user.role === 'EXECUTOR' && (
                                <p>Замовник: {order.client ? order.client.fullName : 'Не вказано'}</p>
                            )}
                            {(user.role === 'ADMIN' || user.role === 'EXECUTOR') && (
                                <p>Статус: {order.status}</p>
                            )}
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
