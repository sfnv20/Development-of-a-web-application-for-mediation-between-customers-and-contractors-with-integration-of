import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const { id } = useParams(); // Отримуємо ID замовлення з URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Не вдалося завантажити деталі замовлення');
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (loading) return <PageLayout title="Деталі замовлення"><p>Завантаження...</p></PageLayout>;

    if (!order) return <PageLayout title="Деталі замовлення"><p>Замовлення не знайдено</p></PageLayout>;

    return (
        <PageLayout title="Деталі замовлення">
            <h3>ID: {order.id}</h3>
            <h5>Title: {order.title}</h5>
            <p><strong>Опис:</strong></p>
            <p>{order.description}</p>
            <p><strong>Дедлайн:</strong> {order.deadline}</p>
            <p><strong>Статус:</strong> {order.status}</p>
            <p><strong>Виконавець:</strong> {order.executor ? `${order.executor.fullName} (ID: ${order.executor.id})` : 'Не призначено'}</p>
            <p><strong>Клієнт: </strong>{order.client ? `${order.client.fullName} (ID: ${order.client.id})` : 'Не призначено'} </p>

            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Назад</button>
        </PageLayout>
    );
};

export default OrderDetails;
