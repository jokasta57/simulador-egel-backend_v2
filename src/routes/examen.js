import {Router} from 'express';
import { crearExamen } from '../controllers/examen.js';
import { crearExamenValidators } from '../middlewares/validators/examen.js';

const router = Router();

router.post('/', crearExamenValidators, crearExamen);

export default router;  
