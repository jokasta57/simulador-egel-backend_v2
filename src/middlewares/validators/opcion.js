
import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearOpcionValidators =  [  //Middlewares
    check('es_correcta', 'Debe indicar si es correcta o no')
    .not().isEmpty().withMessage('El campo es_correcta es obligatorio')
    .isBoolean().withMessage('Debe ser un valor booleano (true o false)'),
    check('contenido_imagen').custom((value, { req }) => {
        const { contenido, imagen_url } = req.body;
        const imagen = req.file; // Aquí obtenemos el archivo de la imagen

        console.log('contenido',contenido);
        console.log('imagen',imagen_url);
        console.log('imagenesss',imagen);

        if (!contenido && !imagen_url && !imagen) {
            throw new Error('Debe haber al menos contenido o una imagen');
        }

        return true;
    }),
    validarCampos
];