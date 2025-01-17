import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearExamenValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('carrera', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('periodo', 'El email es obligatorio y debe ser válido').not().isEmpty(),
    check('duracion', 'El número de cuenta es obligatorio y debe ser único').not().isEmpty(),
    validarCampos
];