import pkg from "sequelize";
const { Sequelize } = pkg;
import 'dotenv/config';
import pg from 'pg'; // Importación explícita requerida para Vercel

const conexion = new Sequelize(process.env.BD_DATABASE, process.env.BD_USER, process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: process.env.BD_DB_PORT,
    dialect: 'postgres',
    dialectModule: pg, // Pasar pg explícitamente a Sequelize
    define:{
        timestamps: false, //Agrega createdAt y updatedAt
        freezeTableName: true //Desactiva el pluralizado
    },
    pool: {
        max: 5,   // Máximo de conexiones por función serverless
        min: 0,   // Mínimo 0 para que cierre conexiones inactivas
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default conexion;