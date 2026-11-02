import pkg from "sequelize";
const { DataTypes } = pkg;
import conexion from "../database/database.js";

const Pregunta = conexion.define('pregunta', {
    id_pregunta: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
    },
    id_examen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contenido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen_url: {
        type: DataTypes.STRING
    },
    public_id_imagen: DataTypes.TEXT,
    orden: {
        type: DataTypes.INTEGER
    },
});

export default Pregunta;