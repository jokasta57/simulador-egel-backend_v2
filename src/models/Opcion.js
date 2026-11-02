import pkg from "sequelize";
const { DataTypes } = pkg;
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
    imagen_url: DataTypes.TEXT,
    es_correcta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    public_id_imagen: DataTypes.TEXT,
});

export default Opcion;