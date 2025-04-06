import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import PageLayout from '../components/PageLayout'; // Імпортуємо базовий дизайн

const CreateOrder = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const { user } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user || !user.id) {
                throw new Error('Не вдалося отримати ID користувача. Будь ласка, увійдіть у систему.');
            }

            const response = await fetch('http://localhost:8080/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: user.id, title, description, deadline }),
            });

            if (!response.ok) throw new Error('Не вдалося створити замовлення');
            toast.success('Замовлення успішно створено!');
            setTitle('');
            setDescription('');
            setDeadline('');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <PageLayout title="Створити замовлення">
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Назва"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
          <textarea
              placeholder="Опис"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
          />
                </div>
                <div className="mb-3">
                    <input
                        type="date"
                        placeholder="Дедлайн"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Створити</button>
            </form>
        </PageLayout>
    );
};

export default CreateOrder;
