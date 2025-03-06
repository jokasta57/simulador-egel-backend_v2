import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearAdminValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('apellido_materno', 'El apellido materno es obligatorio').not().isEmpty(),
    check('carrera', 'La carrera es obligatorio').not().isEmpty(),
    check('numero_identificacion', 'El numero de identificacion debe tener entre 6 y 15 caracteres').not().isEmpty().isLength({ max: 15, min: 6 }),
    check('nip', 'El NIP debe de ser de minimo 6 caracteres').isLength({min: 6}),
    validarCampos
];