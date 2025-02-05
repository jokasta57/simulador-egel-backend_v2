import { generarJWT } from "../helpers/jwt.js";
import Estudiante from "../models/Estudiante.js";

export const crearEstudianteService = async({nombre, apellido_paterno, email, numero_cuenta, carrera, semestre, grupo, ciclo_escolar,nip}) => {
    try {
        //Verificar que no haya duplicados
        const existeUsuario = await Estudiante.findOne({ where: { numero_cuenta } });
        if (existeUsuario) {
            return {
                ok: false,
                status: 409,
                msg: "El número de cuenta ya está registrado. Por favor, verifique sus datos."
            }
        }
        //Crear nuevo estudiante
        const estudiante = await Estudiante.create({
            nombre, 
            apellido_paterno, 
            email, 
            numero_cuenta, 
            carrera, 
            semestre, 
            grupo, 
            ciclo_escolar,
            nip
        })

        return {
            ok: true, 
            status: 201,
            msg: "Estudiante registrado exitosamente",
            estudiante
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

export const loginEstudianteService = async(numero_cuenta, nip) => {
    try {
        //Verificar que el usuario exista
        const estudiante = await Estudiante.findOne({ where: {numero_cuenta } });
        if(!estudiante){
            return {
                ok: false,
                status: 404,
                msg: 'Este usurio no existe',
                token: null
            }
        }

        //Verificar nip
        if(!estudiante.verificarNip(nip)){
            return {
                ok: false,
                status: 401,
                msg: "La contraseña es incorrecta",
                token: null
            }
        }

        const role = 'student'
        //Generar JWT
        const token = await generarJWT(estudiante.id_admin, estudiante.nombre, role);

        return {
            ok: true,
            status: 200,
            msg: 'Usuario autenticado exitosamente',
            token,
            estudiante
        }


    } catch (error) {
        console.log(error);
        return {
            status: 500,
            msg: 'Error en el servidor'
        }
    }
}