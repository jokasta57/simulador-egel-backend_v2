import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearAdminValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('numero_identificacion', 'El numero de identificacion es obligatorio y maximo de 15 caracteres').not().isEmpty().isLength({ max: 15 }),
    check('nip', 'El nip debe de ser de minimo 6 caracteres').isLength({min: 6}),
    validarCampos
];

export const loginValidators =  [  //Middlewares
    check('numero_identificacion', 'El numero de identificacion es obligatorio').not().isEmpty().isLength({max: 15}),
    check('nip', 'El nip debe de ser de minimo 6 caracteres').isLength({min: 6}),
    validarCampos
];