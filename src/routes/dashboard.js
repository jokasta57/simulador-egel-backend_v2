import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerPorcentajeAprobados, obtenerPorcentajeFechas } from '../controllers/dashboard.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/porcentaje-aprobados', validarRol(['admin', 'superAdmin']), obtenerPorcentajeAprobados);

router.get('/porcentaje-fechas', validarRol(['admin', 'superAdmin']), obtenerPorcentajeFechas);

export default router;  