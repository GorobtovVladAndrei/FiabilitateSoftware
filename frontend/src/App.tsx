import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import { getToken, removeToken } from './api';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vulnerabilitate intenționată: Nu verificăm validitatea token-ului
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        removeToken();
        setIsAuthenticated(false);
    };

    return (
        <div className="app">
            <header>
                <h1>Task Manager</h1>
                {isAuthenticated && (
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                )}
            </header>
            <main>
                {isAuthenticated ? <TaskList /> : <Auth onLogin={handleLogin} />}
            </main>
        </div>
    );
}

export default App;
