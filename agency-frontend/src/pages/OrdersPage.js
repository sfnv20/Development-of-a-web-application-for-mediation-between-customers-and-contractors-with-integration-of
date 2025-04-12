import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Modal from 'react-bootstrap/Modal'; // Використовуємо Bootstrap для модального вікна
import Button from 'react-bootstrap/Button';
import FinishedOrdersDropdown from '../components/FinishedOrdersDropdown'; //

const OrdersPage = () => {
    const { user } = useContext(UserContext); // Отримуємо дані користувача
    const [orders, setOrders] = useState([]); // Загальний список замовлень
    const [pendingOrders, setPendingOrders] = useState([]); // Список PENDING замовлень
    const [assignedOrders, setAssignedOrders] = useState([]); // Список призначених замовлень
    const [finishedOrders, setFinishedOrders] = useState([]); // Список завершених замовлень
    const [filteredOrders, setFilteredOrders] = useState([]); // Для фільтрованих замовлень
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingPending, setLoadingPending] = useState(true); // Завантаження PENDING замовлень
    const [loadingAssigned, setLoadingAssigned] = useState(true); // Завантаження призначених замовлень
    const [showModal, setShowModal] = useState(false); // Стан модального вікна
    const [selectedOrderId, setSelectedOrderId] = useState(null); // ID вибраного замовлення
    const [note, setNote] = useState(''); // Примітка виконавця
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                if (user.role === 'CLIENT') {
                    // Клієнт бачить свої замовлення
                    const response = await fetch(`/api/orders/client/${user.id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!response.ok) throw new Error('Не вдалося завантажити замовлення клієнта');
                    const data = await response.json();
                    setOrders(data);
                    setFilteredOrders(data);
                    const finishedResponse = await fetch(`/api/orders/client/${user.id}/finished`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!finishedResponse.ok) throw new Error('Не вдалося завантажити завершені замовлення клієнта');
                    const finishedData = await finishedResponse.json();
                    setFinishedOrders(finishedData);
                } else if (user.role === 'EXECUTOR') {
                    // Виконавець бачить PENDING і призначені замовлення
                    const pendingResponse = await fetch('/api/orders/pending', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!pendingResponse.ok) throw new Error('Не вдалося завантажити PENDING замовлення');
                    const pendingData = await pendingResponse.json();

                    setPendingOrders(pendingData);
                    setLoadingPending(false);

                    const assignedResponse = await fetch(`/api/orders/executor/${user.id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!assignedResponse.ok) throw new Error('Не вдалося завантажити призначені замовлення');
                    const assignedData = await assignedResponse.json();
                    setAssignedOrders(assignedData);
                    setLoadingAssigned(false);
                } else if (user.role === 'ADMIN') {
                    // Адміністратор бачить всі замовлення
                    const response = await fetch('/api/orders', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (!response.ok) throw new Error('Не вдалося завантажити всі замовлення');
                    const data = await response.json();
                    setOrders(data);
                    setFilteredOrders(data);
                } else {
                    throw new Error('Ваша роль не підтримується для цієї сторінки');
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchOrders();
    }, [user]);

    // Фільтрація замовлень
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = orders.filter((order) =>
            order.title.toLowerCase().includes(value) || order.id.toString().includes(value)
        );
        setFilteredOrders(filtered);
    };

    // Відкриття модального вікна
    const handleOpenModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    // Закриття модального вікна
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrderId(null);
        setNote('');
    };

    // Обробка запиту на виконання замовлення
    const handleRequestSubmit = async () => {
        try {
            const response = await fetch('/api/requests/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ executorId: user.id, orderId: selectedOrderId, note }),
            });

            if (!response.ok) throw new Error('Не вдалося подати запит');
            toast.success('Запит успішно подано');
            handleCloseModal(); // Закриваємо модальне вікно після успішного запиту
        } catch (error) {
            toast.error(error.message);
        }
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
            {user.role === 'EXECUTOR' ? (
                <>
                    {/* Панель PENDING замовлень */}
                    <div className="mb-5">
                        <h3>PENDING Замовлення</h3>
                        {loadingPending ? (
                            <p>Завантаження...</p>
                        ) : pendingOrders.length > 0 ? (
                            <ul className="list-group">
                                {pendingOrders.map((order) => (
                                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{order.title} (ID: {order.id})</strong>
                                            <p>{order.description.slice(0, 20)}...</p>
                                            <p>Дедлайн: {order.deadline}</p>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => handleOpenModal(order.id)}>
                                            Подати запит
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>PENDING замовлення відсутні.</p>
                        )}
                    </div>

                    {/* Панель призначених замовлень */}
                    <div>
                        <h3>Призначені Замовлення</h3>
                        {loadingAssigned ? (
                            <p>Завантаження...</p>
                        ) : assignedOrders.length > 0 ? (
                            <ul className="list-group">
                                {assignedOrders.map((order) => (
                                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{order.title} (ID: {order.id})</strong>
                                            <p>{order.description.slice(0, 20)}...</p>
                                            <p>Дедлайн: {order.deadline}</p>
                                        </div>
                                        <button className="btn btn-secondary" onClick={() => navigate(`/orders/${order.id}`)}>
                                            Деталі
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Призначені замовлення відсутні.</p>
                        )}
                    </div>
                    <FinishedOrdersDropdown finishedOrders={finishedOrders} navigate={navigate} />
                </>
            ) : (
                <>
                    {/* Панель для клієнта або адміністратора */}
                    {filteredOrders.length > 0 ? (
                        <ul className="list-group">
                            {filteredOrders
                                .filter((order) => order.status !== 'FINISHED') // Фільтруємо замовлення зі статусом FINISHED
                                .map((order) => (
                                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>ID: {order.id}</strong>
                                            <p><strong>{order.title}</strong></p>
                                            <p>{order.description.slice(0, 20)}</p>
                                            <p>Дедлайн: {order.deadline}</p>
                                            <p>Статус: {order.status}</p>
                                            <p>Виконавець: {order.executor ? `${order.executor.fullName} (ID: ${order.executor.id})` : 'Не призначено'}</p>
                                        </div>
                                        <button className="btn btn-primary" onClick={() => navigate(`/orders/${order.id}`)}>
                                            Деталі
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p>Замовлення не знайдено.</p>
                    )}
                        <FinishedOrdersDropdown finishedOrders={finishedOrders} navigate={navigate} />

                </>

            )}

            {/* Модальне вікно */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Подати запит на виконання</Modal.Title>
                </Modal.Header>
                <Modal.Body>
          <textarea
              placeholder="Введіть вашу примітку..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-control"
          />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleRequestSubmit}>
                        Подати запит
                    </Button>
                </Modal.Footer>
            </Modal>
        </PageLayout>
    );
};

export default OrdersPage;
