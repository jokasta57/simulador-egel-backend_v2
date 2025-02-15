import {Router} from 'express';
import { crearExamen, obtenerExamen, obtenerExamenPorId, editarExamen, obtenerExamenPorCarrera, editarEstadoExamen } from '../controllers/examen.js';
import { crearExamenValidators } from '../middlewares/validators/examen.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['admin', 'superAdmin']), crearExamenValidators, crearExamen);

router.put('/state/:id', validarRol(['admin', 'superAdmin']), editarEstadoExamen);

router.put('/:id', validarRol(['admin', 'superAdmin']), crearExamenValidators, editarExamen);

router.get('/', validarRol(['admin', 'superAdmin']), obtenerExamen);

router.get('/career', validarRol(['admin', 'superAdmin']), obtenerExamenPorCarrera);

router.get('/:id', validarRol(['admin', 'superAdmin']), obtenerExamenPorId);

export default router;  
