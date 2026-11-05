//importar variables de entorno
import {config} from 'dotenv';
import Server from './server/server.js';

// Ejecuta la función config() para cargar las variables de entorno desde el archivo .env
config();

const server = new Server();

// Exportar la app para Vercel (serverless)
export default server.app;

// Solo llamar listen() en desarrollo local
if (process.env.NODE_ENV !== 'production') {
    server.listen();
}
