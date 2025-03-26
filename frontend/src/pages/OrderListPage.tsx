import React, { useEffect, useState } from "react";

interface Order {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    deadline: string | null;
}

const OrderListPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // Додаємо токен для авторизації
                    },
                });
                if (!response.ok) {
                    throw new Error("Не вдалося отримати список замовлень");
                }
                const data = await response.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Список замовлень</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {orders.map((order) => (
                    <li key={order.id} className="list-group-item">
                        <h5>{order.title}</h5>
                        <p>{order.description}</p>
                        <p>
                            Статус:{" "}
                            <span className={`badge bg-${getBadgeClass(order.status)}`}>
                                {order.status}
                            </span>
                        </p>
                        <p>Дата створення: {order.createdAt}</p>
                        {order.deadline && <p>Дедлайн: {order.deadline}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const getBadgeClass = (status: string) => {
    switch (status) {
        case "NEW":
            return "primary";
        case "IN_PROGRESS":
            return "warning";
        case "COMPLETED":
            return "success";
        default:
            return "secondary";
    }
};

export default OrderListPage;
