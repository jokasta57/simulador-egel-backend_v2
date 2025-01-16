import express from 'express';
import authRoutes from './auth.js'
import estudianteRoutes from './estudiante.js'

const app = express();

app.use('/', authRoutes);
app.use('/students', estudianteRoutes);

export default app;