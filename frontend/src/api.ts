import { Task, AuthResponse } from './types';

const API_URL = 'http://localhost:3001';

// Vulnerabilitate intenționată: Token-ul este stocat în localStorage
export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
};

export const api = {
    register: async (username: string, password: string, email: string) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        setToken(data.token);
        return data;
    },

    getTasks: async (queryParams?: string): Promise<Task[]> => {
        const url = queryParams ? `${API_URL}/tasks?${queryParams}` : `${API_URL}/tasks`;
        const response = await fetch(url, {
            headers: {
                ...headers,
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    createTask: async (task: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    deleteTask: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                ...headers,
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete task');
    },

    shareTask: async (taskId: number, username: string): Promise<void> => {
        const response = await fetch(`${API_URL}/tasks/share`, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ taskId, username })
        });
        if (!response.ok) throw new Error('Failed to share task');
    }
}; 