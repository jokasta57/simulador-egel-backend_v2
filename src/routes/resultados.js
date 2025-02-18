import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerCalificacionPorIntento, obtenerResultados, obtenerRevisionPorIntento } from '../controllers/resultados.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/mis-resultados/:id', validarRol(['student']), obtenerResultados);

router.get('/calificacion-intento/:id', validarRol(['student']), obtenerCalificacionPorIntento);

router.get('/revision/:id_intento', validarRol(['student']), obtenerRevisionPorIntento);

export default router;  
