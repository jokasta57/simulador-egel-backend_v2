import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerResultados } from '../controllers/resultados.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/mis-resultados/:id', validarRol(['student']), obtenerResultados);

export default router;  
