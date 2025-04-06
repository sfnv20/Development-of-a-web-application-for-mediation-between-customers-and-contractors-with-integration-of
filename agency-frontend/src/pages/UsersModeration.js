import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

const UsersModeration = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);


    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Не вдалося завантажити список користувачів');
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data); // Початково показуємо всіх користувачів
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    // update role
    const updateUserRole = async (userId, newRole) => {
        if (userId === user.id) {
            toast.error('Ви не можете змінювати свою роль!');
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error('Не вдалося оновити роль користувача');
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

            if (!response.ok) throw new Error('Не вдалося видалити користувача');
            toast.success('Користувача успішно видалено!');
            fetchUsers(); // Оновлюємо список користувачів
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Фільтрація користувачів
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = users.filter((user) =>
            user.fullName.toLowerCase().includes(value) || user.id.toString().includes(value)
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Завантаження користувачів...</p>;

    return (
        <div>
            <input
                type="text"
                placeholder="Пошук за ID або ім'ям..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control mb-3"
            />
            <ul className="list-group">
                {filteredUsers.map((users) => (
                    <li key={users.id} className="list-group-item d-flex justify-content-between align-items-center">
                        ID:{users.id} | {users.fullName} - {users.role}
                        <div>
                            <select
                                value={users.role}
                                onChange={(e) => updateUserRole(users.id, e.target.value)}
                                className="form-select w-auto d-inline-block me-2"
                                disabled={users.id === user.id} // Забороняємо редагувати себе
                            >
                                <option value="CLIENT">Клієнт</option>
                                <option value="EXECUTOR">Виконавець</option>
                                <option value="ADMIN">Адміністратор</option>
                            </select>
                            <button
                                onClick={() => deleteUser(users.id)}
                                className="btn btn-danger btn-sm"
                                disabled={users.id === user.id} // Забороняємо видаляти себе
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
