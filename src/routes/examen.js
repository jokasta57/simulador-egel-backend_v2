import {Router} from 'express';
import { crearExamen, obtenerExamen, obtenerExamenPorId, editarExamen, obtenerExamenPorCarrera, editarEstadoExamen } from '../controllers/examen.js';
import { crearExamenValidators } from '../middlewares/validators/examen.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['admin', 'superadmin']), crearExamenValidators, crearExamen);

router.put('/state/:id', validarRol(['admin', 'superadmin']), editarEstadoExamen);

router.put('/:id', validarRol(['admin', 'superadmin']), crearExamenValidators, editarExamen);

router.get('/', validarRol(['admin', 'superadmin', 'student']), obtenerExamen);

router.get('/career', validarRol(['admin', 'superadmin','student']), obtenerExamenPorCarrera);

router.get('/:id', validarRol(['admin', 'superadmin','student']), obtenerExamenPorId);

export default router;  
