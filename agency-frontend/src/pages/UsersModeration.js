import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

const UsersModeration = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext); // Отримуємо дані авторизованого користувача

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Не вдалося завантажити список користувачів');
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        if (userId === user.id) {
            toast.error('Ви не можете змінювати свою роль!');
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error('Не вдалося оновити роль користувача');
            }

            toast.success('Роль користувача успішно оновлено!');
            fetchUsers(); // Оновлюємо список користувачів
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteUser = async (userId) => {
        if (userId === user.id) {
            toast.error('Ви не можете видалити свій профіль!');
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Не вдалося видалити користувача');
            }

            toast.success('Користувача успішно видалено!');
            fetchUsers(); // Оновлюємо список користувачів
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Завантаження користувачів...</p>;

    return (
        <div>
            <h3>Модерація користувачів</h3>
            <ul className="list-group">
                {users.map((u) => (
                    <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                        ID:{u.id} | {u.fullName} - {u.role}
                        <div>
                            <select
                                value={u.role}
                                onChange={(e) => updateUserRole(u.id, e.target.value)}
                                className="form-select w-auto d-inline-block me-2"
                                disabled={u.id === user.id} // Забороняємо редагувати себе
                            >
                                <option value="CLIENT">Клієнт</option>
                                <option value="EXECUTOR">Виконавець</option>
                                <option value="ADMIN">Адміністратор</option>
                            </select>
                            <button
                                onClick={() => deleteUser(u.id)}
                                className="btn btn-danger btn-sm"
                                disabled={u.id === user.id} // Забороняємо видаляти себе
                            >
                                Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersModeration;
