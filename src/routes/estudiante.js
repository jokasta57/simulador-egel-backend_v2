import {Router} from 'express';
import { crearEstudiantesValidators } from '../middlewares/validators/estudiantes.js';
import { crearEstudiante,loginEstudiante, obtenerInfoDelEstudiante } from '../controllers/estudiante.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/', crearEstudiantesValidators, crearEstudiante);
router.post('/auth', loginEstudiante);

router.get('/:id', validarJWT, obtenerInfoDelEstudiante);

export default router;  
