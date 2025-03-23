import React, { useState, useEffect } from 'react';
import api from '../api/api';

// Визначаємо тип для замовлення
interface Order {
    id: number;
    title: string;
    description: string;
    status: string;
}

const OrderList = () => {
    // Вказуємо TypeScript, що orders — це масив об'єктів типу Order
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                console.log('Отримані замовлення:', response.data); // Лог для перевірки
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
