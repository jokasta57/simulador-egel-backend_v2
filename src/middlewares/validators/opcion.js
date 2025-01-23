
import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearOpcionValidators =  [  //Middlewares
    check('contenido', 'La opcion no puede estar vacía').not().isEmpty(),
    check('es_correcta', 'Debe indicar si es correcta o no').not().isEmpty(),
    validarCampos
];