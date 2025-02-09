import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

// router.post('/', validarRol(['student']), crearIntento);

// router.get('/:id', validarRol(['student']), obtenerIntentoPorId);

// router.put('/:id', validarRol(['student']), actualizarIntento);

export default router;  
