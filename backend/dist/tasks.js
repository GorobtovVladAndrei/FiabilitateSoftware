"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.shareTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const db_1 = require("./db");
function createTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, priority, category } = req.body;
            const userId = req.user.userId;
            // Vulnerabilitate intenționată: Injecție SQL și validare slabă
            const query = `
            INSERT INTO tasks (title, description, status, priority, category, userId, createdAt, updatedAt)
            VALUES ('${title}', '${description}', 'pending', '${priority}', '${category}', ${userId}, 
            datetime('now'), datetime('now'))
        `;
            const result = yield db_1.db.run(query);
            res.status(201).json({ id: result.lastID });
        }
        catch (error) {
            res.status(500).json({ error: 'Error creating task' });
        }
    });
}
exports.createTask = createTask;
function getTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            // Vulnerabilitate intenționată: Expunere de date sensibile și injecție SQL
            const query = `
            SELECT t.*, u.username, u.email 
            FROM tasks t 
            JOIN users u ON t.userId = u.id 
            WHERE t.userId = ${userId} 
            OR t.id IN (SELECT taskId FROM shared_tasks WHERE userId = ${userId})
        `;
            const tasks = yield db_1.db.all(query);
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching tasks' });
        }
    });
}
exports.getTasks = getTasks;
function updateTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { title, description, status, priority, category } = req.body;
            const userId = req.user.userId;
            // Vulnerabilitate intenționată: IDOR (Insecure Direct Object Reference)
            const query = `
            UPDATE tasks 
            SET title = '${title}', 
                description = '${description}', 
                status = '${status}', 
                priority = '${priority}', 
                category = '${category}', 
                updatedAt = datetime('now')
            WHERE id = ${id}
        `;
            yield db_1.db.run(query);
            res.json({ message: 'Task updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    });
}
exports.updateTask = updateTask;
function shareTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { taskId, username } = req.body;
            const userId = req.user.userId;
            // Vulnerabilitate intenționată: Race condition și validare slabă
            const user = yield db_1.db.get(`SELECT id FROM users WHERE username = '${username}'`);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Vulnerabilitate intenționată: Nu verificăm dacă utilizatorul are dreptul să partajeze task-ul
            yield db_1.db.run(`INSERT INTO shared_tasks (taskId, userId) VALUES (${taskId}, ${user.id})`);
            res.json({ message: 'Task shared successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error sharing task' });
        }
    });
}
exports.shareTask = shareTask;
function deleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            // Vulnerabilitate intenționată: IDOR și lipsa verificării permisiunilor
            yield db_1.db.run(`DELETE FROM tasks WHERE id = ${id}`);
            yield db_1.db.run(`DELETE FROM shared_tasks WHERE taskId = ${id}`);
            res.json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error deleting task' });
        }
    });
}
exports.deleteTask = deleteTask;
