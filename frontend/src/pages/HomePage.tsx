import React from "react";

const HomePage = () => {
    return (
        <div className="container mt-4">
            <h1>Ласкаво просимо до нашої платформи!</h1>
            <p>Цей проєкт створений для посередництва між замовниками та виконавцями.</p>

            <section style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                <h2>Наші можливості:</h2>
                <ul style={{ lineHeight: "1.8" }}>
                    <li>Безпечне середовище для співпраці</li>
                    <li>Простота використання</li>
                    <li>Прозорість замовлень</li>
                    <li>Можливість ручної обробки без автоматизацій та статусів</li>
                </ul>
            </section>
        </div>
    );
};

export default HomePage;
