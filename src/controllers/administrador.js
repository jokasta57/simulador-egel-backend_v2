import { crearAdministradorService, obtenerAdministradoresService, actualizarAdministradorService, eliminarAdministradorService } from "../services/administrador.js";


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

export const obtenerAdministradores = async (req, res) => {
    try {

        const { status, ok, msg, administradores } = await obtenerAdministradoresService();


        res.status(status).json({
            ok,
            msg,
            administradores
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const actualizarAdministrador = async (req, res) => {
    try {

        const { status, ok, msg, administradores } = await actualizarAdministradorService();


        res.status(status).json({
            ok,
            msg,
            administradores
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const eliminarAdministrador = async (req, res) => {
    try {

        const { status, ok, msg, administradores } = await eliminarAdministradorService();


        res.status(status).json({
            ok,
            msg,
            administradores
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}