import { DataTypes } from "sequelize";
import conexion from "../database/database.js";
import bcrypt from 'bcrypt';

const Estudiante = conexion.define('estudiante', {
    numero_cuenta: {
        type: DataTypes.STRING, // Número de cuenta como clave primaria
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING,
        allowNull: true // Puede ser opcional
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true // Validación de email
        }
    },
    carrera: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semestre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Semestre mínimo
            max: 12 // Asume que el máximo es 10
        }
    },
    grupo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ciclo_escolar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async function(estudiante){
            const salt = await bcrypt.genSalt(10)
            estudiante.nip = await bcrypt.hash(estudiante.nip, salt);
        }
    }
})
//Metodos personalizados
Estudiante.prototype.verificarNip  = function(nip){
    return bcrypt.compareSync(nip, this.nip); //nip es la constante que envio el usuario y this.nip es desde la base de datos a comparar
}

export default Estudiante;
