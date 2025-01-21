import { generarJWT } from "../helpers/jwt.js";
import Admin from "../models/Admin.js";
import { Sequelize } from 'sequelize';

export const crearAdministradorService = async(nombre, numero_identificacion, nip) => {
    try {
        //Verificar que no haya duplicados
        const existeUsuario = await Admin.findOne({ where: { numero_identificacion } });
        if (existeUsuario) {
            return {
                ok: false,
                status: 409,
                msg: "Este usuario ya existe"
            }
        }
        //Crear nuevo administrador
        const admin = await Admin.create({
            nombre, 
            numero_identificacion, 
            nip
        })


        return {
            ok: true, 
            status: 201,
            msg: "Administrador creado exitosamente",
            admin
        };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const loginService = async( numero_identificacion, nip) => {
    try {
        //Verificar que el usuario exista
        const admin = await Admin.findOne({ where: {numero_identificacion } });
        if(!admin){
            return {
                ok: false,
                status: 404,
                msg: 'Este usurio no existe',
                token: null
            }
        }

        //Verificar nip
        if(!admin.verificarNip(nip)){
            return {
                ok: false,
                status: 401,
                msg: "La contraseña es incorrecta",
                token: null
            }
        }

        const role = 'admin'
        //Generar JWT
        const token = await generarJWT(admin.id_admin, admin.nombre, role);

        return {
            ok: true,
            status: 200,
            msg: 'Usuario autenticado exitosamente',
            token,
            admin
        }


    } catch (error) {
        console.log(error);
        return {
            status: 500,
            msg: 'Error en el servidor'
        }
    }
}