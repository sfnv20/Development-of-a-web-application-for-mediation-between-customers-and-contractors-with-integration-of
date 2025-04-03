import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

const ExecutorOrders = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/orders/executor/${user.id}`, {
                    headers: {
                        'User-Role': user.role,
                    },
                });
                if (!response.ok) throw new Error('Помилка завантаження замовлень');
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchOrders();
    }, [user]);

    return (
        <div className="container mt-5">
            <h2>Призначені замовлення</h2>
            <ul className="list-group">
                {orders.map((order) => (
                    <li key={order.id} className="list-group-item">
                        <strong>{order.title}</strong> - Замовник: {order.client.fullName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExecutorOrders;
