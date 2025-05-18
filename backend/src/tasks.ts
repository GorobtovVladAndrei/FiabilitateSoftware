import { Request, Response } from 'express';
import { db } from './db';

export async function createTask(req: Request, res: Response) {
    try {
        const { 
            title, 
            description, 
            priority, 
            category, 
            deadline,
            color,
            reminderTime,
            notes
        } = req.body;
        const userId = (req as any).user.userId;

        const result = await db.run(
            `INSERT INTO tasks (
                title, description, status, priority, category,
                deadline, color, reminderTime, notes, userId, 
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [
                title, 
                description, 
                'pending',
                priority,
                category,
                deadline,
                color || '#E0E0E0',
                reminderTime,
                notes,
                userId
            ]
        );
        
        const newTask = await db.get(
            'SELECT * FROM tasks WHERE id = ?',
            [result.lastID]
        );
        
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Error creating task. Please try again.' });
    }
}

export async function getTasks(req: Request, res: Response) {
    try {
        const userId = (req as any).user.userId;
        const { 
            status, 
            priority, 
            category, 
            sortBy, 
            sortOrder,
            isStarred,
            dueSoon, // pentru task-uri cu deadline apropiat
            search   // pentru căutare în titlu și descriere
        } = req.query;
        
        let query = `
            SELECT t.*, u.username
            FROM tasks t 
            JOIN users u ON t.userId = u.id 
            WHERE (t.userId = ? 
                  OR t.id IN (SELECT taskId FROM shared_tasks WHERE userId = ?))
        `;

        const queryParams: any[] = [userId, userId];

        if (status) {
            query += ' AND t.status = ?';
            queryParams.push(status);
        }
        if (priority) {
            query += ' AND t.priority = ?';
            queryParams.push(priority);
        }
        if (category) {
            query += ' AND t.category = ?';
            queryParams.push(category);
        }
        if (isStarred === 'true') {
            query += ' AND t.isStarred = 1';
        }
        if (dueSoon === 'true') {
            query += ` AND t.deadline IS NOT NULL 
                      AND t.deadline <= datetime('now', '+3 days')
                      AND t.deadline >= datetime('now')`;
        }
        if (search) {
            query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        if (sortBy) {
            query += ` ORDER BY t.${sortBy} ${sortOrder || 'ASC'}`;
        } else {
            query += ' ORDER BY t.createdAt DESC';
        }
        
        const tasks = await db.all(query, queryParams);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
}

export async function updateTask(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { 
            title, 
            description, 
            status, 
            priority, 
            category, 
            deadline,
            color,
            reminderTime,
            isStarred,
            notes
        } = req.body;
        const userId = (req as any).user.userId;

        // Verifică dacă task-ul există și aparține utilizatorului
        const existingTask = await db.get(
            'SELECT * FROM tasks WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        const updates: any = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (status !== undefined) updates.status = status;
        if (priority !== undefined) updates.priority = priority;
        if (category !== undefined) updates.category = category;
        if (deadline !== undefined) updates.deadline = deadline;
        if (color !== undefined) updates.color = color;
        if (reminderTime !== undefined) updates.reminderTime = reminderTime;
        if (isStarred !== undefined) updates.isStarred = isStarred ? 1 : 0;
        if (notes !== undefined) updates.notes = notes;
        updates.updatedAt = 'datetime(\'now\')';

        const updateFields = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const updateValues = Object.values(updates);

        await db.run(
            `UPDATE tasks SET ${updateFields} WHERE id = ? AND userId = ?`,
            [...updateValues, id, userId]
        );

        const updatedTask = await db.get(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        res.json({ 
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task. Please try again.' });
    }
}

export async function toggleStar(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;

        const task = await db.get(
            'SELECT isStarred FROM tasks WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        await db.run(
            'UPDATE tasks SET isStarred = ?, updatedAt = datetime(\'now\') WHERE id = ?',
            [task.isStarred ? 0 : 1, id]
        );

        res.json({ 
            message: 'Task star toggled successfully',
            isStarred: !task.isStarred
        });
    } catch (error) {
        console.error('Error toggling task star:', error);
        res.status(500).json({ error: 'Error toggling task star' });
    }
}

export async function deleteTask(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;

        // Verificăm mai întâi dacă task-ul există și aparține utilizatorului
        const task = await db.get(
            'SELECT * FROM tasks WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        // Ștergerea din shared_tasks se face automat datorită ON DELETE CASCADE

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Error deleting task' });
    }
}

export async function shareTask(req: Request, res: Response) {
    try {
        const { taskId, username } = req.body;
        const userId = (req as any).user.userId;

        // Verificăm dacă utilizatorul există
        const targetUser = await db.get(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificăm dacă task-ul există și aparține utilizatorului care îl partajează
        const task = await db.get(
            'SELECT * FROM tasks WHERE id = ? AND userId = ?',
            [taskId, userId]
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found or access denied' });
        }

        // Verificăm dacă task-ul este deja partajat cu utilizatorul
        const existingShare = await db.get(
            'SELECT * FROM shared_tasks WHERE taskId = ? AND userId = ?',
            [taskId, targetUser.id]
        );

        if (existingShare) {
            return res.status(400).json({ error: 'Task already shared with this user' });
        }

        await db.run(
            'INSERT INTO shared_tasks (taskId, userId) VALUES (?, ?)',
            [taskId, targetUser.id]
        );
        
        res.json({ message: 'Task shared successfully' });
    } catch (error) {
        console.error('Error sharing task:', error);
        res.status(500).json({ error: 'Error sharing task' });
    }
} 