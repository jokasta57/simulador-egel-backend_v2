import { generarJWT } from "../helpers/jwt.js";
import Admin from "../models/Admin.js";
import pkg from 'sequelize';
const { Sequelize } = pkg;
import bcrypt from 'bcryptjs';


export const crearAdministradorService = async(nombre, numero_identificacion, nip, apellido_paterno, apellido_materno) => {
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
            nip,
            apellido_paterno, 
            apellido_materno,
        })


        return {
            ok: true, 
            status: 201,
            msg: "Administrador creado exitosamente",
            admin
        };

    } catch (error) {
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
        const admin = await Admin.findOne({ where: { numero_identificacion } });
        if(!admin){
            return {
                ok: false,
                status: 404,
                msg: 'El usuario no está registrado',
                token: null
            }
        }

        //Verificar nip
        if(!admin.verificarNip(nip)){
            return {
                ok: false,
                status: 401,
                msg: "Verifica tus credenciales e intenta de nuevo.",
                token: null
            }
        }

        
        let role = admin?.superadmin ? 'superadmin' : 'admin'
        
        admin.role = role;

        //Generar JWT
        const token = await generarJWT(admin.id_admin, admin.nombre, admin.apellido_paterno, admin.apellido_materno, role, admin.numero_identificacion, admin.carrera);
        
        return {
            ok: true,
            status: 200,
            msg: 'Usuario autenticado exitosamente',
            token,
            admin
        }


    } catch (error) {
        console.error('[loginService]', error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor',
            token: null
        }
    }
}

export const actualizarPasswordService = async(numero_identificacion, nip_actual, nip_nuevo) => {
    try {
        //Verificar que el usuario exista
        const admin = await Admin.findOne({ where: {numero_identificacion } });
        if(!admin){
            return {
                ok: false,
                status: 404,
                msg: 'El usuario no está registrado',
                token: null
            }
        }

        // Verificar nip
        const nipValido = await bcrypt.compare(nip_actual, admin.nip);
        if (!nipValido) {
            return {
                ok: false,
                status: 401,
                msg: "Verifica tu NIP actual e intenta de nuevo.",
                token: null
            };
        }

         // Actualizar y guardar la nueva contraseña
         admin.nip = nip_nuevo;
         await admin.save(); // Esto dispara el hook `beforeUpdate`
        
        return {
            ok: true,
            status: 200,
            msg: 'Contraseña actualizada exitosamente',
            // admin
        }


    } catch (error) {
        return {
            status: 500,
            msg: 'Error en el servidor'
        }
    }
}