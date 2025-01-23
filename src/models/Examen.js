import { DataTypes } from "sequelize";
import conexion from "../database/database.js";

const Examen = conexion.define('examen', {
    id_examen: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
    },
    carrera: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    periodo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duracion: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha_modificacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING
    }
});

export default Examen;