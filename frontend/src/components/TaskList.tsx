import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { api } from '../api';

export const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Partial<Task>>({ 
        title: '', 
        description: '', 
        priority: 'medium' as 'low' | 'medium' | 'high', 
        category: '',
        deadline: ''
    });
    const [shareUsername, setShareUsername] = useState('');
    const [selectedTask, setSelectedTask] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: ''
    });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');

    useEffect(() => {
        loadTasks();
    }, [filters, sortBy, sortOrder]);

    const loadTasks = async () => {
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                sortBy,
                sortOrder
            });
            const tasks = await api.getTasks(queryParams.toString());
            setTasks(tasks);
        } catch (err) {
            setError('Failed to load tasks');
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createTask(newTask);
            setNewTask({ 
                title: '', 
                description: '', 
                priority: 'medium' as 'low' | 'medium' | 'high', 
                category: '',
                deadline: ''
            });
            loadTasks();
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleUpdateStatus = async (taskId: number, status: 'pending' | 'completed') => {
        try {
            await api.updateTask(taskId, { status });
            loadTasks();
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await api.deleteTask(taskId);
            loadTasks();
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const handleShareTask = async (taskId: number) => {
        try {
            await api.shareTask(taskId, shareUsername);
            setShareUsername('');
            setSelectedTask(null);
            loadTasks();
        } catch (err) {
            setError('Failed to share task');
        }
    };

    return (
        <div className="task-list">
            <div className="task-form">
                <div className="task-form-header">
                    <h2>Create New Task</h2>
                    <p>Fill in the details to create a new task</p>
                </div>
                
                <form onSubmit={handleCreateTask}>
                    <div className="task-form-grid">
                        <div className="form-group">
                            <label>
                                <span className="label-text">Title</span>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="Enter task title"
                                    required
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                <span className="label-text">Category</span>
                                <input
                                    type="text"
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                    placeholder="Enter category"
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                <span className="label-text">Priority</span>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                    className="input-field"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                <span className="label-text">Deadline</span>
                                <input
                                    type="datetime-local"
                                    value={newTask.deadline}
                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    className="input-field"
                                />
                            </label>
                        </div>

                        <div className="form-group span-2">
                            <label>
                                <span className="label-text">Description</span>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Enter task description"
                                    className="input-field"
                                    rows={4}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="task-form-actions">
                        <button type="submit" className="primary-button">
                            Create Task
                        </button>
                    </div>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="filters">
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="input-field"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Priority</label>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        className="input-field"
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input-field"
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="deadline">Deadline</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Order</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="input-field"
                    >
                        <option value="ASC">Ascending</option>
                        <option value="DESC">Descending</option>
                    </select>
                </div>
            </div>

            <div className="tasks">
                {tasks.map(task => (
                    <div key={task.id} className={`task-item priority-${task.priority}`}>
                        <h3>{task.title}</h3>
                        <p className="task-description">{task.description}</p>
                        <div className="task-meta">
                            <span>Priority: {task.priority}</span>
                            <span>Category: {task.category}</span>
                            <span>Status: {task.status}</span>
                            {task.deadline && (
                                <span>Deadline: {new Date(task.deadline).toLocaleString()}</span>
                            )}
                        </div>
                        
                        <div className="task-actions">
                            <button
                                onClick={() => handleUpdateStatus(task.id, task.status === 'pending' ? 'completed' : 'pending')}
                                className={`status-button ${task.status}`}
                            >
                                {task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="danger-button">
                                Delete
                            </button>
                            <button onClick={() => setSelectedTask(task.id)} className="share-button">
                                Share
                            </button>
                        </div>
                        
                        {selectedTask === task.id && (
                            <div className="share-form">
                                <input
                                    type="text"
                                    placeholder="Username to share with"
                                    value={shareUsername}
                                    onChange={(e) => setShareUsername(e.target.value)}
                                    className="input-field"
                                />
                                <div className="share-actions">
                                    <button onClick={() => handleShareTask(task.id)} className="primary-button">
                                        Share
                                    </button>
                                    <button onClick={() => setSelectedTask(null)} className="secondary-button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}; 