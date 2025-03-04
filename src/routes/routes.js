import express from 'express';
import authRoutes from './auth.js'
import estudianteRoutes from './estudiante.js'
import examenRoutes from './examen.js'
import preguntaRoutes from './pregunta.js'
import opcionRoutes from './opcion.js'
import respuestaRoutes from './respuesta.js'
import intentoRoutes from './intento_examen.js'
import resultadosRoutes from './resultados.js'
import dashboardRoutes from './dashboard.js'
import adminRoutes from './administrador.js'

const app = express();

app.use('/', authRoutes);
app.use('/students', estudianteRoutes);
app.use('/exams', examenRoutes);
app.use('/questions', preguntaRoutes);
app.use('/options', opcionRoutes);
app.use('/answers', respuestaRoutes);
app.use('/attempt', intentoRoutes);
app.use('/results', resultadosRoutes);
app.use('/admin-dashboard', dashboardRoutes);
app.use('/admin-managment', adminRoutes);

export default app;