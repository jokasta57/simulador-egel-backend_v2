import pkg from "sequelize";
const { DataTypes, Model } = pkg;
import conexion from "../database/database.js";
import bcrypt from 'bcryptjs';

class Estudiante extends Model {
    verificarNip(nip) {
        return bcrypt.compareSync(nip, this.nip);
    }
}

Estudiante.init({
    numero_cuenta: {
        type: DataTypes.STRING,
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
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
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
            min: 1,
            max: 12
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
    sequelize: conexion,
    modelName: 'estudiante',
    timestamps: false,
    freezeTableName: true,
    hooks: {
        beforeCreate: async function(estudiante) {
            const salt = await bcrypt.genSalt(10);
            estudiante.nip = await bcrypt.hash(estudiante.nip, salt);
        }
    }
});

export default Estudiante;
