import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

const OrdersList = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let endpoint;

                if (user.role === 'CLIENT') {
                    endpoint = `/api/orders/client/${user.id}`;
                } else if (user.role === 'EXECUTOR') {
                    endpoint = `/api/orders/executor/${user.id}`;
                } else if (user.role === 'ADMIN') {
                    endpoint = `/api/orders/admin`;
                }

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Role': user.role,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Помилка завантаження замовлень: ${response.statusText}`);
                }

                const data = await response.json();
                setOrders(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return <div className="container mt-5">Завантаження замовлень...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Список замовлень</h2>
            {orders.length > 0 ? (
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

export default OrdersList;
