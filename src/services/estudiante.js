import { generarJWT } from "../helpers/jwt.js";
import Estudiante from "../models/Estudiante.js";

export const crearEstudianteService = async({nombre, apellido_paterno, apellido_materno, email, numero_cuenta, carrera, semestre, grupo, ciclo_escolar,nip}) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 4000));
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
            apellido_materno,
            email, 
            numero_cuenta, 
            carrera, 
            semestre, 
            grupo, 
            ciclo_escolar,
            nip
        })

        const role = 'student'

        const token = await generarJWT(estudiante.numero_cuenta, estudiante.nombre,estudiante.apellido_paterno, estudiante.apellido_materno, role);

        return {
            ok: true, 
            status: 201,
            msg: "Estudiante registrado exitosamente",
            token,
            estudiante
        };

    } catch (error) {
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
        const token = await generarJWT(estudiante.numero_cuenta, estudiante.nombre,estudiante.apellido_paterno, estudiante.apellido_materno, role);

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

export const obtenerInfoDelEstudianteService = async(numero_cuenta) => {
    try {
        //Verificar que el usuario exista
        const estudiante = await Estudiante.findOne({ 
            where: { 
                numero_cuenta 
            },
            attributes: ["numero_cuenta", "nombre", "apellido_paterno", "apellido_materno", "email", "carrera", "semestre", "grupo", "ciclo_escolar"]
        });

        if(!estudiante){
            return {
                ok: false,
                status: 404,
                msg: 'Este usurio no existe',
                estudiante: null
            }
        }

        return {
            ok: true,
            status: 200,
            msg: 'Usuario autenticado exitosamente',
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

export const actualizarInfoEstudianteService = async(numero_cuenta, updateData) => {
    try { 
        //Verificar que el usuario exista
        const estudiante = await Estudiante.findOne({ 
            where: { 
                numero_cuenta 
            }
        });

        if(!estudiante || estudiante.length === 0){
            return {
                ok: false,
                status: 404,
                msg: 'Este usurio no existe',
            }
        }

        await Estudiante.update(updateData, { where: { numero_cuenta } })

        return {
            ok: true,
            status: 200,
            msg: 'Usuario autenticado exitosamente',
        }


    } catch (error) {
        console.log(error);
        return {
            status: 500,
            msg: 'Error en el servidor'
        }
    }
}