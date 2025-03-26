import { generarJWT } from "../helpers/jwt.js";
import Estudiante from "../models/Estudiante.js";
import { crearAdministradorService, loginService, actualizarPasswordService } from "../services/auth.js";

export const crearAdministrador = async (req, res) => {
    try {

        const { nombre, numero_identificacion, nip, apellido_paterno, apellido_materno } = req.body;


        const { status, ok, msg, admin } = await crearAdministradorService(nombre, numero_identificacion, nip,  apellido_paterno, apellido_materno);


        res.status(status).json({
            ok,
            msg,
            uid: admin?.id_admin,
            nombre: admin?.nombre
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const loginUsuario = async (req, res) => {
    try {

        const { numero_identificacion, nip } = req.body;
        
        const { ok, status, msg, token, admin } = await loginService(numero_identificacion, nip);

        res.status(status).json({
            ok,
            msg,
            token,
            admin
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const actualizarPassword = async (req, res) => {
    try {

        const { numero_identificacion, nip_actual, nip_nuevo } = req.body;

        const { ok, status, msg, } = await actualizarPasswordService(numero_identificacion, nip_actual, nip_nuevo);

        res.status(status).json({
            ok,
            msg,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const revalidarToken = async (req, res) => {
    try {

        const id = req.uid;
        const nombre = req.name;
        const apellido_paterno = req.apellido_paterno;
        const apellido_materno = req.apellido_materno;
        const role = req.role;
        const numero_identificacion = req.numero_identificacion;
        // console.log(req);

        //Generar un nuevo JWT y retornarlo en esta peticion
        const token = await generarJWT(id, nombre, apellido_paterno,apellido_materno,  role, numero_identificacion);

        let additionalInfo;
        if(role === 'student'){
            const estudiante = await Estudiante.findOne({where: {numero_cuenta: id}});
            additionalInfo = {
                numero_cuenta: estudiante.numero_cuenta,
                carrera: estudiante.carrera
            };
        }

        res.json({
            ok: true,
            id, nombre, role, apellido_paterno, apellido_materno, numero_identificacion,
            token,
            ...additionalInfo
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}