import { DataTypes } from "sequelize";
import conexion from "../database/database.js";

const Intento_examen = conexion.define('intento_examen', {
    id_intento: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
    },
    numero_cuenta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_examen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_aplicacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    calificacion: DataTypes.INTEGER
});

export default Intento_examen;