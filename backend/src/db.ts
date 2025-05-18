import sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase, open } from 'sqlite';
import path from 'path';

let db: SQLiteDatabase;

async function initializeDb() {
    // Intenționat folosim sincronizare slabă pentru a demonstra probleme de concurență
    db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT UNIQUE
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            status TEXT CHECK(status IN ('pending', 'completed')),
            priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
            category TEXT,
            userId INTEGER,
            createdAt TEXT,
            updatedAt TEXT,
            FOREIGN KEY (userId) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS shared_tasks (
            taskId INTEGER,
            userId INTEGER,
            FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            PRIMARY KEY (taskId, userId)
        );
    `);

    // Adăugăm coloanele noi dacă nu există
    const tableInfo = await db.all("PRAGMA table_info(tasks)");
    const columns = tableInfo.map(col => col.name);

    if (!columns.includes('deadline')) {
        await db.exec('ALTER TABLE tasks ADD COLUMN deadline TEXT');
    }
    if (!columns.includes('color')) {
        await db.exec('ALTER TABLE tasks ADD COLUMN color TEXT DEFAULT "#E0E0E0"');
    }
    if (!columns.includes('reminderTime')) {
        await db.exec('ALTER TABLE tasks ADD COLUMN reminderTime TEXT');
    }
    if (!columns.includes('isStarred')) {
        await db.exec('ALTER TABLE tasks ADD COLUMN isStarred INTEGER DEFAULT 0');
    }
    if (!columns.includes('notes')) {
        await db.exec('ALTER TABLE tasks ADD COLUMN notes TEXT');
    }
}

export { db, initializeDb }; 