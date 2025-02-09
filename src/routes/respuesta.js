import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { actualizarRespuesta, crearRespuesta, obtenerRespuestaPorId } from '../controllers/respuesta.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['student']), crearRespuesta);

router.get('/:id', validarRol(['student']), obtenerRespuestaPorId);

router.put('/:id', validarRol(['student']), actualizarRespuesta);

export default router;  
