import express, { Application } from 'express';
import cors from 'cors';
import { initializeDb } from './db';
import { register, login, authenticateToken } from './auth';
import { createTask, getTasks, updateTask, deleteTask, shareTask } from './tasks';

const app: Application = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rute publice
app.post('/register', register);
app.post('/login', login);

// Rute protejate
app.use(authenticateToken);
app.post('/tasks', createTask);
app.get('/tasks', getTasks);
app.put('/tasks/:id', updateTask);
app.delete('/tasks/:id', deleteTask);
app.post('/tasks/share', shareTask);

async function startServer() {
    try {
        await initializeDb();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 