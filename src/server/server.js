import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import conexion from '../database/database.js';
import routes from '../routes/routes.js'

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //conectar base de datos
        this.conectarBD();

        //Middlewares
        this.middlewares();
        
        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarBD(){
        try {
            await conexion.authenticate();
            // conexion.sync();
            console.log('Base de datos en linea');
        } catch(error){
            throw new Error(error);
        }
    }
    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Habilitar cookie parser
        this.app.use(cookieParser());
    }

    routes() {
        this.app.use(routes);
    }

    listen() {
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en el puerto',this.port );
        })
    }
}

export default Server;