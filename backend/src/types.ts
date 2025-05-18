export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    category: string;
    tags: string[];
    deadline?: string;
    userId: number;
    sharedWith: number[];
    createdAt: string;
    updatedAt: string;
} 