import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const OrdersPage = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // Для фільтрованих замовлень
    const [searchTerm, setSearchTerm] = useState('');
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
                    endpoint = `/api/orders/executor/${user.id}/approved`;
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
                setFilteredOrders(data); // Початково показуємо всі замовлення
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    // Фільтрація замовлень
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = orders.filter((order) =>
            order.title.toLowerCase().includes(value) || order.id.toString().includes(value)
        );
        setFilteredOrders(filtered);
    };

    if (!user) return null;

    return (
        <PageLayout title="Список замовлень">
            <input
                type="text"
                placeholder="Пошук за ID або назвою..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control mb-3"
            />
            {loading ? (
                <p>Завантаження замовлень...</p>
            ) : filteredOrders.length > 0 ? (
                <ul className="list-group">
                    {filteredOrders.map((order) => (
                        <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>ID: {order.id} </strong>
                                <p><strong>{order.title}</strong></p>
                                <p>{order.description.slice(0, 20)}</p>
                                <p>Дедлайн: {order.deadline}</p>
                                <p>Статус: {order.status}</p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                Деталі
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Замовлення не знайдено.</p>
            )}
        </PageLayout>
    );
};

export default OrdersPage;
