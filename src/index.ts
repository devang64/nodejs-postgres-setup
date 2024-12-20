import express from 'express';
import { SERVER_PORT } from './config/EnvConfig';
import errorHandling from './middlewares/ErrorHandler';
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import pool from './config/db';
const app = express();


const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandling);
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', userRoutes)
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database()');
        res.status(200).json({ message: `Database:${result.rows[0].current_database} connected successfully` });
    } catch (err: any) {
        res.status(500).json({ message: 'Database connection failed', error: err.stack });
    }
});

app.listen(SERVER_PORT, () => {
    console.log(`App is listening on port ${SERVER_PORT}`);
});
