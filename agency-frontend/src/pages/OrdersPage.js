import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const OrdersPage = () => {
    const { user } = useContext(UserContext); // Отримуємо дані користувача
    const [orders, setOrders] = useState([]); // Стан для замовлень
    const [loading, setLoading] = useState(true); // Стан для завантаження
    const navigate = useNavigate(); // Для навігації

    useEffect(() => {
        if (!user) {
            navigate('/'); // Перенаправляємо на головну сторінку, якщо користувач не авторизований
            return;
        }

        const fetchOrders = async () => {
            try {
                let endpoint;

                if (user.role === 'CLIENT') {
                    endpoint = `/api/orders/client/${user.id}`;
                } else if (user.role === 'EXECUTOR') {
                    endpoint = `/api/orders/executor/${user.id}/approved`;
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
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <PageLayout title="Список замовлень">
            {loading ? (
                <p>Завантаження замовлень...</p>
            ) : orders.length > 0 ? (
                <ul className="list-group">
                    {orders.map((order) => (
                        <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>ID: {order.id}  | </strong>
                                <strong>Title: {order.title}</strong>
                                <p>{order.description.slice(0, 20)}...</p> {/* Скорочуємо опис до 20 символів */}
                                <p>Дедлайн: {order.deadline}</p>
                                <p>Статус: {order.status}</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/orders/${order.id}`)} // Перехід на сторінку деталей
                            >
                                Деталі
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Замовлення відсутні.</p>
            )}
        </PageLayout>
    );
};

export default OrdersPage;
