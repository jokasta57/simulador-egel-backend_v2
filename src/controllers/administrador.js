import { crearAdministradorService, obtenerAdministradoresService, actualizarAdministradorService, eliminarAdministradorService } from "../services/administrador.js";


export const crearAdministrador = async (req, res) => {
    try {

        const { nombre, numero_identificacion, nip, apellido_paterno, apellido_materno, carrera } = req.body;


        const { status, ok, msg, admin } = await crearAdministradorService(nombre, numero_identificacion, nip,  apellido_paterno, apellido_materno, carrera);


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
    const {id_admin} = req.params;
    const newData = req.body
    try {

        const { status, ok, msg } = await actualizarAdministradorService(id_admin, newData);


        res.status(status).json({
            ok,
            msg
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
    const {id_admin} = req.params;
    try {

        const { status, ok, msg } = await eliminarAdministradorService(id_admin);


        res.status(status).json({
            ok,
            msg
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}