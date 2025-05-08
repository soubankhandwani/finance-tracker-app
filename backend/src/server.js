import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import { authenticateToken } from './middlewares/auth.middleware.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use express JSON middleware
app.use(express.json());

// To send cookies
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Personal Financial Tracker App</h1>');
});

app.post('/protected', authenticateToken, (req, res) => {
  res.send(`<h1>Welcome authenticated user. ID: ${req.user.id}</h1>`);
});

app.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));
