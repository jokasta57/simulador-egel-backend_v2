import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearExamenValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('carrera', 'La carrera es obligatoria').not().isEmpty(),
    check('periodo', 'El periodo es obligatorio').not().isEmpty(),
    check('duracion', 'La duración del examen es obligatoria').not().isEmpty(),
    check('area', 'El area es obligatorio').not().isEmpty(),
    validarCampos
];