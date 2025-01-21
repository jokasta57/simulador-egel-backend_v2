import {Router} from 'express';
import { crearEstudiantesValidators } from '../middlewares/validators/estudiantes.js';
import { crearEstudiante,loginEstudiante } from '../controllers/estudiante.js';

const router = Router();

router.post('/', crearEstudiantesValidators, crearEstudiante);
router.post('/login', loginEstudiante);

export default router;  
