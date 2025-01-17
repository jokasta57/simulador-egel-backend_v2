import { DataTypes } from "sequelize";
import conexion from "../database/database.js";

const Opcion = conexion.define('opcion', {
    id_opcion: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
    },
    id_pregunta: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imagen_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    es_correcta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

export default Opcion;