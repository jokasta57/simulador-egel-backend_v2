import {Router} from 'express';
import { crearAdministrador, loginUsuario, revalidarToken } from '../controllers/auth.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { loginValidators } from '../middlewares/validators/auth.js';
import { crearAdminValidators } from '../middlewares/validators/auth.js';

const router = Router();

router.post('/admin', crearAdminValidators, crearAdministrador);

router.post('/admin/auth', loginValidators, loginUsuario);

router.get('/users/renew', validarJWT, revalidarToken);

export default router;  
