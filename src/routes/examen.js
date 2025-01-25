import {Router} from 'express';
import { crearExamen, obtenerExamen, obtenerExamenPorId, editarExamen } from '../controllers/examen.js';
import { crearExamenValidators } from '../middlewares/validators/examen.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['admin']), crearExamenValidators, crearExamen);

router.put('/:id', validarRol(['admin']), crearExamenValidators, editarExamen);

router.get('/', validarRol(['admin']), obtenerExamen);

router.get('/:id', validarRol(['admin']), obtenerExamenPorId);

export default router;  
