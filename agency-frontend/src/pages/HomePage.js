import React from 'react';
import { motion } from 'framer-motion'; // Імпортуємо Framer Motion
import './HomePage.css'; // Стилі для головної сторінки

const HomePage = () => {
    return (
        <div className="homepage">
            {/* Головний банер */}
            <motion.header
                className="banner"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="banner-title">Welcome to WNEVER Agency</h1>
                <p className="banner-subtitle">Знайдіть найкращих виконавців для своїх завдань</p>
            </motion.header>

            {/* Інструкція */}
            <motion.section
                className="instructions"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h2>Як це працює?</h2>
                <div className="steps">
                    <motion.div
                        className="step"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <h3><b>Зареєструйтеся</b></h3>
                        <p>Створіть обліковий запис за кілька хвилин.</p>
                    </motion.div>
                    <motion.div
                        className="step"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <h3><b>Створіть замовлення</b></h3>
                        <p>Опишіть своє завдання та знайдіть виконавця.</p>
                    </motion.div>
                    <motion.div
                        className="step"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <h3><b>Отримуйте результат</b></h3>
                        <p>Ваше завдання буде виконане вчасно та якісно.</p>
                    </motion.div>
                </div>
            </motion.section>

            {/* FAQ */}
            <motion.section
                className="faq"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <h2><b>FAQ</b></h2>
                <ul>
                    <li><strong>Як це працює?</strong> - Ви реєструєтеся, створюєте замовлення, а виконавець виконує його.</li>
                    <li><strong>Як зареєструватися?</strong> - Натисніть "Реєстрація" у верхньому меню та заповніть форму.</li>
                    <li><strong>Чому ми?</strong> - Ми пропонуємо швидкість, надійність і якість.</li>
                    <li><strong>Про проєкт</strong> - WNEVER Agency — платформа для з'єднання клієнтів і виконавців.</li>
                </ul>
            </motion.section>

            {/* Про нас */}
            <motion.section
                className="about-us"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5 }}
            >
                <h2>Про нас</h2>
                <p>(Цей розділ ви можете заповнити пізніше.)</p>
            </motion.section>

            {/* Футер */}
            <footer className="footer">
                Made by Mykyta Trashchii in 2025
            </footer>
        </div>
    );
};

export default HomePage;
