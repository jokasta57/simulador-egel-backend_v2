import {Router} from 'express';
import { crearAdministrador, loginUsuario, revalidarToken, actualizarPassword } from '../controllers/auth.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { loginValidators } from '../middlewares/validators/auth.js';
import { crearAdminValidators, newPasswordValidators } from '../middlewares/validators/auth.js';

const router = Router();

router.post('/admin', crearAdminValidators, crearAdministrador);

router.post('/admin/auth', loginValidators, loginUsuario);

router.get('/users/renew', validarJWT, revalidarToken);

router.put('/admin-password', validarJWT, newPasswordValidators,  actualizarPassword);

export default router;  
