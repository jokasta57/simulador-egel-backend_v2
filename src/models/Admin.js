import pkg from "sequelize";
const { DataTypes, Model } = pkg;
import conexion from "../database/database.js";
import bcrypt from 'bcrypt';

class Admin extends Model {
    verificarNip(nip) {
        return bcrypt.compareSync(nip, this.nip);
    }
}

Admin.init({
    id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
        allowNull: false
    },
    numero_identificacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    carrera: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    superadmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize: conexion,
    modelName: 'admin',
    timestamps: false,
    freezeTableName: true,
    hooks: {
        beforeCreate: async function(administrador) {
            const salt = await bcrypt.genSalt(10);
            administrador.nip = await bcrypt.hash(administrador.nip, salt);
        },
        beforeUpdate: async function(administrador) {
            if (administrador.changed("nip")) {
                const salt = await bcrypt.genSalt(10);
                administrador.nip = await bcrypt.hash(administrador.nip, salt);
            }
        }
    }
});

export default Admin;
