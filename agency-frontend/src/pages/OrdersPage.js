import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout'; // Імпортуємо базовий дизайн

const OrdersPage = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                let endpoint;

                if (user.role === 'CLIENT') {
                    endpoint = `/api/orders/client/${user.id}`;
                } else if (user.role === 'EXECUTOR') {
                    endpoint = `/api/orders/executor/${user.id}`;
                } else if (user.role === 'ADMIN') {
                    endpoint = `/api/orders`;
                } else {
                    throw new Error('Ваша роль не підтримується для цієї сторінки');
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Не вдалося завантажити замовлення');
                const data = await response.json();
                setOrders(data);
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
        </PageLayout>
    );
};

export default OrdersPage;
