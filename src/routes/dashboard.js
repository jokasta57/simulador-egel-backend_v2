import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerPorcentajeAprobados, obtenerPorcentajeFechas, obtenerBorradores, obtenerRendimientoPorPregunta } from '../controllers/dashboard.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/porcentaje-aprobados', validarRol(['admin', 'superAdmin']), obtenerPorcentajeAprobados);

router.get('/porcentaje-fechas', validarRol(['admin', 'superAdmin']), obtenerPorcentajeFechas);

router.get('/borradores', validarRol(['admin', 'superAdmin']), obtenerBorradores);

router.get('/rendimiento-preguntas/:id_examen', validarRol(['admin', 'superAdmin']), obtenerRendimientoPorPregunta);

export default router;  