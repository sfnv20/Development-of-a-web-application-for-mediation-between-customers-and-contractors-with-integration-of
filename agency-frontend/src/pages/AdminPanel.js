import React from 'react';
import UsersModeration from './UsersModeration';
import OrdersModeration from './OrdersModeration';

const AdminPanel = () => {
    return (
        <div className="container mt-5">
            <h2>Адмін-панель</h2>
            <div className="mt-4">
                <UsersModeration />
            </div>
            <hr />
            <div className="mt-4">
                <OrdersModeration />
            </div>
        </div>
    );
};

export default AdminPanel;
