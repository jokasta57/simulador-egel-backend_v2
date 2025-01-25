import {Router} from 'express';
import { crearPreguntaValidators } from '../middlewares/validators/pregunta.js';
import { crearPregunta, editarPregunta, eliminarPregunta, eliminarImagenPregunta, obtenerPreguntaPorId, obtenerPreguntaPorOrden, obtenerPreguntaPorExamen } from '../controllers/pregunta.js';
import { errorHandlingImages } from '../middlewares/errors/multerErrorHandler.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/id/:id', validarRol(['admin', 'estudiante']), obtenerPreguntaPorId);

router.get('/orden', validarRol(['admin', 'estudiante']), obtenerPreguntaPorOrden);

router.get('/exam/:id', validarRol(['admin', 'estudiante']), obtenerPreguntaPorExamen);

//Logueado como admin
router.use(validarRol(['admin']));

router.post('/', errorHandlingImages, crearPreguntaValidators, crearPregunta);

router.put('/:id', errorHandlingImages, editarPregunta);

router.put('/imagen/:id', errorHandlingImages, eliminarImagenPregunta);

router.delete('/:id', eliminarPregunta);

export default router;  
