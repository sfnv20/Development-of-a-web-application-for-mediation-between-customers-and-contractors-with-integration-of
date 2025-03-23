import React, { useState, useEffect } from 'react';
import api from '../api/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Помилка отримання замовлень:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div>
            <h2>Список замовлень</h2>
            {orders.map((order: any) => (
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
