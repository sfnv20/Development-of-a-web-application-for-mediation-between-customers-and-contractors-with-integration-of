import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const OrdersModeration = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не вдалося завантажити список замовлень');
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Не вдалося оновити статус замовлення');
            }

            toast.success('Статус замовлення успішно оновлено!');
            fetchOrders(); // Оновлюємо список замовлень
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Не вдалося видалити замовлення');
            }

            toast.success('Замовлення успішно видалено!');
            fetchOrders(); // Оновлюємо список замовлень
        } catch (error) {
            toast.error(error.message);
        }
    };
    const assignExecutor = async (orderId, executorId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/executor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ executorId }),
            });

            if (!response.ok) throw new Error('Не вдалося призначити виконавця');
            toast.success('Виконавець успішно призначений!');
            fetchOrders(); // Оновлюємо список замовлень
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p>Завантаження замовлень...</p>;

    return (
        <div>
            <h3>Модерація замовлень</h3>
            <ul className="list-group">
                {orders.map((order) => (
                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                        ID: {order.id} - Title: {order.title} - Status: {order.status} | ID: {order.executor.id} - {order.executor ? order.executor.fullName : 'Не призначено'}
                        <div>
                            <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="form-select w-auto d-inline-block me-2"
                            >
                                <option value="PENDING">Очікується</option>
                                <option value="APPROVED">Підтверджено</option>
                            </select>
                            <button onClick={() => assignExecutor(order.id, prompt('Введіть ID виконавця'))}
                                    className="btn btn-primary btn-sm">
                                Призначити виконавця
                            </button>
                            <button onClick={() => deleteOrder(order.id)} className="btn btn-danger btn-sm">Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersModeration;
