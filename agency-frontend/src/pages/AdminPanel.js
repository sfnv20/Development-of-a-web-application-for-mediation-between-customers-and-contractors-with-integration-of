import React from 'react';
import PageLayout from '../components/PageLayout'; // Імпортуємо базовий шаблон
import UsersModeration from './UsersModeration';
import OrdersModeration from './OrdersModeration';

const AdminPanel = () => {
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
            </div>
        </PageLayout>
    );
};

export default AdminPanel;
