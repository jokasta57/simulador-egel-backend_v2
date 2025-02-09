import { DataTypes } from "sequelize";
import conexion from "../database/database.js";

const Respuesta = conexion.define('respuesta', {
    id_respuesta: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
    },
    id_opcion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_intento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    es_correcta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

export default Respuesta;