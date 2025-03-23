import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    email: string;
}

const AdminPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) throw new Error('Користувач не авторизований.');

                const response = await axios.get('http://localhost:8080/api/admin/unapproved-users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                setError('Не вдалося завантажити список користувачів.');
            }
        };

        fetchUsers();
    }, []);

    const assignRole = async (userId: number, role: string) => {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) throw new Error('Користувач не авторизований.');

            await axios.put(`http://localhost:8080/api/admin/assign-role/${userId}?role=${role}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`Роль ${role} успішно призначена!`);
            setUsers(users.filter((user) => user.id !== userId));
        } catch (err) {
            alert('Не вдалося призначити роль.');
        }
    };

    return (
        <div>
            <h1>Адмін Панель</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => assignRole(user.id, 'CLIENT')}>Призначити CLIENT</button>
                            <button onClick={() => assignRole(user.id, 'EXECUTOR')}>Призначити EXECUTOR</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
