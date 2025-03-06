import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { crearAdminValidators } from '../middlewares/validators/administrador.js';
import { obtenerAdministradores, crearAdministrador, actualizarAdministrador, eliminarAdministrador  } from '../controllers/administrador.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.post('/', validarRol(['superAdmin']), crearAdminValidators, crearAdministrador);

router.get('/', validarRol(['superAdmin']), obtenerAdministradores);

router.put('/:id_admin', validarRol(['superAdmin']), actualizarAdministrador);

router.delete('/:id_admin', validarRol(['superAdmin']), eliminarAdministrador);


export default router;  