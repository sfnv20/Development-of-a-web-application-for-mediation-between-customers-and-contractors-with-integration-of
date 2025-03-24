import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Order {
    id: number;
    title: string;
    description: string;
    status: string;
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders', {
                    withCredentials: true, // Передаємо сесії або кукі разом із запитом
                });
                setOrders(response.data);
            } catch (err) {
                setError('Не вдалося завантажити замовлення.');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Список замовлень</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {orders.map((order) => (
                <div key={order.id}>
                    <h3>{order.title}</h3>
                    <p>{order.description}</p>
                    <p>Статус: {order.status}</p>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
