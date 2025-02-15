import {Router} from 'express';
import { crearOpcionValidators } from '../middlewares/validators/opcion.js';
import { errorHandlingImages } from '../middlewares/errors/multerErrorHandler.js';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { crearOpcion, eliminarOpcion, editarOpcion, eliminarImagenOpcion } from '../controllers/opcion.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

// router.get('/', validarRol(['admin', 'estudiante']), obtenerPregunta);

//Logueado como admin
router.use(validarRol(['admin', 'superAdmin']));

router.post('/', errorHandlingImages, crearOpcionValidators, crearOpcion);

router.put('/:id', errorHandlingImages, crearOpcionValidators, editarOpcion);

router.put('/imagen/:id', eliminarImagenOpcion);

router.delete('/:id', eliminarOpcion);

export default router;  
