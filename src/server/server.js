import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import conexion from '../database/database.js';
import routes from '../routes/routes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Equivalente a __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // Conectar base de datos
        this.conectarBD();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarBD() {
        try {
            await conexion.authenticate();
            console.log('Base de datos en línea');
        } catch (error) {
            console.error('Error al conectar la base de datos:', error);
        }
    }

    middlewares() {
        // CORS
        const corsOptions = {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'x-token', 'Authorization'],
            credentials: true
        };
        this.app.use(cors(corsOptions));

        // Lectura y parseo del body
        this.app.use(express.json());

        // Habilitar cookie parser
        this.app.use(cookieParser());

        // Configuración de Swagger
        this.configurarSwagger();
    }

    configurarSwagger() {
        try {
            // Ruta al archivo swagger.yaml
            const swaggerFilePath = path.join(__dirname, '..', '..', 'docs', 'swagger.yaml');
            
            // Verificar si el archivo existe
            if (fs.existsSync(swaggerFilePath)) {
                // Cargar el documento Swagger
                const swaggerDocument = yaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));
                
                // Configurar Swagger UI
                this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
                
                console.log('Documentación Swagger configurada correctamente');
            } else {
                console.warn('Archivo swagger.yaml no encontrado. La documentación de API no estará disponible.');
            }
        } catch (error) {
            console.error('Error al configurar Swagger:', error);
        }
    }

    routes() {
        this.app.use(routes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo`);
        });
    }
}

export default Server;