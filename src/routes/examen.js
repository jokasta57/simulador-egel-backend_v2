import {Router} from 'express';
import { crearExamen, obtenerExamen, obtenerExamenPorId, editarExamen, obtenerExamenPorCarrera, editarEstadoExamen } from '../controllers/examen.js';
import { crearExamenValidators } from '../middlewares/validators/examen.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['admin']), crearExamenValidators, crearExamen);

router.put('/state/:id', validarRol(['admin']), editarEstadoExamen);

router.put('/:id', validarRol(['admin']), crearExamenValidators, editarExamen);

router.get('/', validarRol(['admin']), obtenerExamen);

router.get('/career', validarRol(['admin', 'student']), obtenerExamenPorCarrera);

router.get('/:id', validarRol(['admin']), obtenerExamenPorId);

export default router;  
