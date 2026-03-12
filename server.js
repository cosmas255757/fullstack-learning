import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- REGISTRATION ROUTE ---
app.post('/api/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert into MySQL
        // Note: 'role' will fall back to 'borrower' if not provided because of your DB schema
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'borrower']
        );

        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Email already exists.' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const user = rows[0];

        // 2. Compare the password with the hashed one in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // 3. Success! Send back the role
        res.json({ 
            success: true, 
            message: 'Login successful!',
            role: user.role,
            username: user.username 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
