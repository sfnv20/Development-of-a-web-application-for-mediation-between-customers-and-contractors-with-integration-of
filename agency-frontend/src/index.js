import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './UserContext';
import { createRoot } from 'react-dom/client';

// Знаходимо кореневий елемент у HTML
const rootElement = document.getElementById('root');

// Створюємо "root" за допомогою ReactDOM.createRoot
const root = createRoot(rootElement);

// Рендеримо головний компонент App
root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>,
);
