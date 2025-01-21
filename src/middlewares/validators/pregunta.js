import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearPreguntaValidators =  [  //Middlewares
    check('contenido', 'La pregunta no puede estar vacía').not().isEmpty(),
    validarCampos
];