import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { crearAdminValidators } from '../middlewares/validators/administrador.js';
import { obtenerAdministradores, crearAdministrador, actualizarAdministrador, eliminarAdministrador  } from '../controllers/administrador.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['superadmin']), crearAdminValidators, crearAdministrador);

router.get('/', validarRol(['superadmin']), obtenerAdministradores);

router.put('/:id_admin', validarRol(['superadmin']), actualizarAdministrador);

router.delete('/:id_admin', validarRol(['superadmin']), eliminarAdministrador);


export default router;  