import {Router} from 'express';
import { validarJWT, validarRol } from '../middlewares/validar-jwt.js';
import { obtenerAdministradores, crearAdministrador, actualizarAdministrador, eliminarAdministrador  } from '../controllers/administrador.js';

const router = Router();

//El usuario debe estar logueado para poder hacer peticiones
router.use( validarJWT );

router.get('/', validarRol(['superAdmin']), obtenerAdministradores);

router.post('/', validarRol(['superAdmin']), crearAdministrador);

router.put('/:id_admin', validarRol(['superAdmin']), actualizarAdministrador);

router.delete('/:id_admin', validarRol(['superAdmin']), eliminarAdministrador);


export default router;  