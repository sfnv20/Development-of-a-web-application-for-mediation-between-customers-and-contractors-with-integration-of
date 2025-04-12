import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout'; // Імпортуємо базовий шаблон
import UsersModeration from './UsersModeration';
import OrdersModeration from './OrdersModeration';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [requests, setRequests] = useState([]); // Список запитів
    const [loadingRequests, setLoadingRequests] = useState(true); // Стан завантаження запитів

    // Завантаження запитів на виконання замовлень
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/requests/pending', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Не вдалося завантажити запити');
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoadingRequests(false);
            }
        };

        fetchRequests();
    }, []);

    // Схвалення запиту
    const handleApproveRequest = async (requestId) => {
        try {
            const response = await fetch(`/api/requests/${requestId}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Не вдалося схвалити запит');
            toast.success('Запит успішно схвалено');
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Відхилення запиту
    const handleRejectRequest = async (requestId) => {
        try {
            const response = await fetch(`/api/requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED' }),
            });

            if (!response.ok) throw new Error('Не вдалося відхилити запит');
            toast.success('Запит успішно відхилено');
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <PageLayout title="Адмін-панель">
            <div className="admin-section">
                {/* Модерація користувачів */}
                <section className="moderation-section">
                    <UsersModeration />
                </section>

                <hr />

                {/* Модерація замовлень */}
                <section className="moderation-section">
                    <OrdersModeration />
                </section>

                <hr />

                {/* Панель обробки запитів */}
                <section className="moderation-section">
                    <h3>Обробка запитів</h3>
                    {loadingRequests ? (
                        <p>Завантаження запитів...</p>
                    ) : requests.length > 0 ? (
                        <ul className="list-group">
                            {requests.map((request) => (
                                <li key={request.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <p><strong>Замовлення ID:</strong> {request.order.id}</p>
                                        <p><strong>Виконавець:</strong> {request.executor.fullName}</p>
                                        <p><strong>Примітка:</strong> {request.note}</p>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleApproveRequest(request.id)}
                                        >
                                            Схвалити
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRejectRequest(request.id)}
                                        >
                                            Відхилити
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Немає запитів на обробку.</p>
                    )}
                </section>
            </div>
        </PageLayout>
    );
};

export default AdminPanel;
