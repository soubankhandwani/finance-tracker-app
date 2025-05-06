import express from 'express';
import { config } from 'dotenv';

import authRoutes from './routes/auth.routes.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use express JSON middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Personal Financial Tracker App</h1>');
});

app.listen(PORT, () => console.log(`Server is listening at port: ${PORT}`));
