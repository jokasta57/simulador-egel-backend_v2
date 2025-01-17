import express from 'express';
import authRoutes from './auth.js'
import estudianteRoutes from './estudiante.js'
import examenRoutes from './examen.js'

const app = express();

app.use('/', authRoutes);
app.use('/students', estudianteRoutes);
app.use('/exams', examenRoutes);

export default app;