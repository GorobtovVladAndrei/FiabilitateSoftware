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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
let db;
exports.db = db;
function initializeDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // Intenționat folosim sincronizare slabă pentru a demonstra probleme de concurență
        exports.db = db = yield (0, sqlite_1.open)({
            filename: path_1.default.join(__dirname, '../database.sqlite'),
            driver: sqlite3_1.default.Database
        });
        yield db.exec(`
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
            FOREIGN KEY (taskId) REFERENCES tasks(id),
            FOREIGN KEY (userId) REFERENCES users(id),
            PRIMARY KEY (taskId, userId)
        );
    `);
    });
}
exports.initializeDb = initializeDb;
