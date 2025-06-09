import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrdersModeration = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Не вдалося завантажити список замовлень');
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data); // Початково показуємо всі замовлення
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Фільтрація замовлень
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = orders.filter((order) =>
            order.title.toLowerCase().includes(value) || order.id.toString().includes(value)
        );
        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Не вдалося оновити статус замовлення');
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

            if (!response.ok) throw new Error('Не вдалося видалити замовлення');
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

            {/* Поле пошуку */}
            <input
                type="text"
                placeholder="Пошук за ID або назвою..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control mb-3"
            />

            <ul className="list-group">
                {filteredOrders.map((order) => (
                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                        ID: {order.id} | {order.title} | Статус: {order.status} |
                        Виконавець: {order.executor ? `${order.executor.fullName} (ID: ${order.executor.id})` : 'Не призначено'} |
                        Клієнт: {order.client ? `${order.client.fullName} (ID: ${order.client.id})` : 'Не призначено'}
                        <div>
                            {/* Кнопка для зміни статусу */}
                            <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className="form-select w-auto d-inline-block me-2"
                            >
                                <option value="PENDING">Очікується</option>
                                <option value="APPROVED">Підтверджено</option>
                                <option value="REJECTED">Відхилено</option>
                                <option value="FINISHED">Завершено</option>
                            </select>

                            {/* Кнопка для перегляду деталей */}
                            <button
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="btn btn-primary btn-sm me-2"
                            >
                                Деталі
                            </button>

                            {/* Кнопка для призначення виконавця */}
                            <button
                                onClick={() => assignExecutor(order.id, prompt('Введіть ID виконавця'))}
                                className="btn btn-secondary btn-sm me-2"
                            >
                                Призначити виконавця
                            </button>

                            {/* Кнопка для видалення */}
                            <button
                                onClick={() => deleteOrder(order.id)}
                                className="btn btn-danger btn-sm"
                            >
                                Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersModeration;
