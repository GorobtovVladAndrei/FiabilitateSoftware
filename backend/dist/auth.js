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
exports.authenticateToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("./db");
const JWT_SECRET = 'your-secret-key'; // Vulnerabilitate intenționată: Secret hardcodat
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password, email } = req.body;
            // Vulnerabilitate intenționată: Validare slabă
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }
            // Vulnerabilitate intenționată: Hashing fără salt
            const hashedPassword = bcryptjs_1.default.hashSync(password, 8);
            // Vulnerabilitate intenționată: SQL injection posibilă
            const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;
            yield db_1.db.run(query);
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error registering user' });
        }
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            // Vulnerabilitate intenționată: SQL injection posibilă
            const query = `SELECT * FROM users WHERE username = '${username}'`;
            const user = yield db_1.db.get(query);
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Vulnerabilitate intenționată: Token fără expirare
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
            res.json({ token });
        }
        catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    });
}
exports.login = login;
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }
    // Vulnerabilitate intenționată: Nu verificăm dacă tokenul a expirat
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}
exports.authenticateToken = authenticateToken;
