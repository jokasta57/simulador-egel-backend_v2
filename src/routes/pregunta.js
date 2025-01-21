import {Router} from 'express';
import { crearPreguntaValidators } from '../middlewares/validators/pregunta.js';
import { crearPregunta } from '../controllers/pregunta.js';
import { errorHandlingImages } from '../middlewares/errors/multerErrorHandler.js';

const router = Router();

router.post('/', errorHandlingImages, crearPreguntaValidators, crearPregunta);

export default router;  
