import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerPorcentajeAprobados, obtenerPorcentajeFechas, obtenerBorradores, obtenerRendimientoPorPregunta, obtenerUltimoExamenAplicado, obtenerCalificacionesYResumen } from '../controllers/dashboard.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/porcentaje-aprobados', validarRol(['admin', 'superadmin']), obtenerPorcentajeAprobados);

router.get('/porcentaje-fechas', validarRol(['admin', 'superadmin']), obtenerPorcentajeFechas);

router.get('/borradores', validarRol(['admin', 'superadmin']), obtenerBorradores);

router.get('/rendimiento-preguntas/:id_examen', validarRol(['admin', 'superadmin']), obtenerRendimientoPorPregunta);

router.get('/ultimo-examen-aplicado', validarRol(['admin', 'superadmin']), obtenerUltimoExamenAplicado);

router.get('/ultimo-examen-aplicado', validarRol(['admin', 'superadmin']), obtenerUltimoExamenAplicado);

router.get('/calificaciones-resumen/:id_examen', validarRol(['admin', 'superadmin']), obtenerCalificacionesYResumen);

export default router;  