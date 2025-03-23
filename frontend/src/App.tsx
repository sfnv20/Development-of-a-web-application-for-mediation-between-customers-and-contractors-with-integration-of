import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CreateOrderPage from './pages/CreateOrderPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create-order" element={<CreateOrderPage />} />
            </Routes>
        </Router>
    );
};

export default App;
