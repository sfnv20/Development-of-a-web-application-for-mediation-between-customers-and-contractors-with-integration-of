import React, {useState, useEffect, useRef, useContext} from 'react';
import { CSSTransition } from 'react-transition-group'; // Для анімації
import './FinishedOrdersDropdown.css';
import {UserContext} from "../UserContext"; // Стилі для анімації

const FinishedOrdersDropdown = ({ navigate }) => {
    const [finishedOrders, setFinishedOrders] = useState([]); // Список завершених замовлень
    const [loading, setLoading] = useState(true); // Стан завантаження
    const [isOpen, setIsOpen] = useState(false); // Стан для управління видимістю списку
    const dropdownRef = useRef(null); // Створюємо ref для списку
    const { user } = useContext(UserContext); // Отримуємо дані користувача

    useEffect(() => {
        const fetchFinishedOrders = async () => {
            try {
                let endpoint;
                if (user.role === 'CLIENT') {
                    endpoint = `/api/orders/client/${user.id}/finished`;
                } else if (user.role === 'EXECUTOR') {
                    endpoint = `/api/orders/executor/${user.id}/finished`;
                } else if (user.role === 'ADMIN') {
                    endpoint = `/api/orders/finished`;
                }

                if (!endpoint) return;

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Не вдалося завантажити завершені замовлення');
                const data = await response.json();
                setFinishedOrders(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFinishedOrders();
    }, [user]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); // Перемикання стану
    };

    return (
        <div className="finished-orders-dropdown">
            {/* Красиво оформлений текст для відкриття/закриття списку */}
            <div
                className="dropdown-toggle-text"
                onClick={toggleDropdown}
                style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: isOpen ? '#007bff' : '#495057',
                    textAlign: 'left',
                    marginBottom: '10px',
                    transition: 'color 0.3s ease-in-out',
                }}
            >
                {isOpen ? 'Сховати завершені замовлення ⬆️' : 'Показати завершені замовлення ⬇️'}
            </div>

            {/* Анімований список завершених замовлень */}
            <CSSTransition
                in={isOpen}
                timeout={300}
                classNames="dropdown"
                unmountOnExit
                nodeRef={dropdownRef} // Передаємо ref до CSSTransition
            >
                <ul className="list-group" ref={dropdownRef}>
                    {loading ? (
                        <p>Завантаження...</p>
                    ) : finishedOrders.length > 0 ? (
                        finishedOrders.map((order) => (
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
                        ))
                    ) : (
                        <p>Завершені замовлення не знайдено.</p>
                    )}
                </ul>
            </CSSTransition>
        </div>
    );
};

export default FinishedOrdersDropdown;
