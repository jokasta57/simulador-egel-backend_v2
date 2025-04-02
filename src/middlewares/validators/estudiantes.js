import { check } from 'express-validator';
import { validarCampos } from './validarCampos.js';

export const crearEstudiantesValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('numero_cuenta', 'El número de cuenta es obligatorio y debe ser único').not().isEmpty(),
    check('nip', 'El NIP debe de ser de minimo 4 caracteres').isLength({min: 4}),
    check('carrera', 'La carrera es obligatoria').not().isEmpty(),
    check('semestre', 'El semestre es obligatorio y debe ser un número entre 1 y 12').isInt({ min: 1, max: 12 }),
    check('grupo', 'El grupo es obligatorio').not().isEmpty(),
    check('ciclo_escolar', 'El ciclo escolar es obligatorio').not().isEmpty(),
    validarCampos
];

export const actualizarInfoEstudianteValidators =  [  //Middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio y debe ser válido').isEmail(),
    check('numero_cuenta', 'El número de cuenta es obligatorio y debe ser único').not().isEmpty(),
    check('carrera', 'La carrera es obligatoria').not().isEmpty(),
    check('semestre', 'El semestre es obligatorio y debe ser un número entre 1 y 12').isInt({ min: 1, max: 12 }),
    check('grupo', 'El grupo es obligatorio').not().isEmpty(),
    check('ciclo_escolar', 'El ciclo escolar es obligatorio').not().isEmpty(),
    validarCampos
];

export const loginValidators =  [  //Middlewares
    check('numero_cuenta', 'El numero de cuenta es obligatorio').not().isEmpty().isLength({max: 15}),
    check('nip', 'El nip debe de ser de minimo 6 caracteres').isLength({min: 6}),
    validarCampos
];