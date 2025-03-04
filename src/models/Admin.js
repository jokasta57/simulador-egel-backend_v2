import { DataTypes } from "sequelize";
import conexion from "../database/database.js";
import bcrypt from 'bcrypt';

const Admin = conexion.define('admin', {
    id_admin: {
        type: DataTypes.INTEGER, 
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, // Añadido para autoincremento
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
    superAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async function(administrador){
            const salt = await bcrypt.genSalt(10)
            administrador.nip = await bcrypt.hash(administrador.nip, salt);
        },
        beforeUpdate: async function(administrador){
            if (administrador.changed("nip")) { // Solo rehashea si cambió el NIP
                const salt = await bcrypt.genSalt(10);
                administrador.nip = await bcrypt.hash(administrador.nip, salt);
            }
        }
    }
})

//Metodos personalizados
Admin.prototype.verificarNip  = function(nip){
    return bcrypt.compareSync(nip, this.nip); //nip es la constante que envio el usuario y this.nip es desde la base de datos a comparar
}

export default Admin;