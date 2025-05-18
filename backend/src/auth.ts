import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';

const JWT_SECRET = 'your-secret-key'; // Vulnerabilitate intenționată: Secret hardcodat

export async function register(req: Request, res: Response) {
    try {
        const { username, password, email } = req.body;

        // Vulnerabilitate intenționată: Validare slabă
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Verifică dacă username sau email există deja
        const existingUser = await db.get('SELECT username, email FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.username === username ? 'Username already exists' : 'Email already exists'
            });
        }

        // Vulnerabilitate intenționată: Hashing fără salt
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Folosim parametrizare pentru a preveni SQL injection
        await db.run(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user. Please try again.' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        // Vulnerabilitate intenționată: SQL injection posibilă
        const query = `SELECT * FROM users WHERE username = '${username}'`;
        const user = await db.get(query);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Vulnerabilitate intenționată: Token fără expirare
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    // Vulnerabilitate intenționată: Nu verificăm dacă tokenul a expirat
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        (req as any).user = user;
        next();
    });
} 