import React, { createContext, useState } from 'react';

// Створюємо контекст
export const UserContext = createContext();

// Провайдер для глобального стану користувача
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Завантажуємо дані користувача з localStorage при завантаженні сторінки
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData); // Зберігаємо всі дані користувача, включаючи id
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
