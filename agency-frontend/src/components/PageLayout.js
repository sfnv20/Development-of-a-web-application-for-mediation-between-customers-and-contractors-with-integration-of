import React from 'react';
import { motion } from 'framer-motion'; // Імпортуємо Framer Motion
import './PageLayout.css'; // Стилі для загального дизайну

const PageLayout = ({ title, children }) => {
    return (
        <motion.div
            className="page-layout"
            initial={{ opacity: 0, y: -50 }} // Початковий стан (прозорість і зміщення вгору)
            animate={{ opacity: 1, y: 0 }} // Кінцевий стан (повна прозорість і початкове положення)
            transition={{ duration: 0.8 }} // Тривалість анімації
        >
            {/* Заголовок сторінки */}
            <header className="page-header">
                <h1>{title}</h1>
            </header>

            {/* Контент сторінки */}
            <main className="page-content">{children}</main>

            {/* Футер */}
            <footer className="page-footer">
                Made by Mykyta Trashchii in 2025
            </footer>
        </motion.div>
    );
};

export default PageLayout;
