import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { authenticate } from './middleware/auth.js';
import prisma from './utils/prisma.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);

// Protected route example
app.get('/me', authenticate, (req, res) => {
    res.json({ message: `Hello user ${req.user.userId}` });
});

prisma.$connect()
    .then(() => {
        console.log('✅ Database connected successfully');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((error) => {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    });
