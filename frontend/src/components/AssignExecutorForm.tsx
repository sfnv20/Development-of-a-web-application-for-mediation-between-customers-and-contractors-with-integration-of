import React, { useState } from 'react';
import api from '../api/api';

const AssignExecutorForm = ({ orderId }: { orderId: number }) => {
    const [executorId, setExecutorId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/orders/${orderId}/assign-executor`, executorId);
            alert('Виконавець призначений!');
        } catch (error) {
            console.error('Помилка призначення виконавця:', error);
            alert('Помилка призначення виконавця');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>ID Виконавця:</label>
                <input
                    type="number"
                    value={executorId}
                    onChange={(e) => setExecutorId(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Призначити виконавця</button>
        </form>
    );
};

export default AssignExecutorForm;
