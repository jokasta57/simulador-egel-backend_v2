import { generarJWT } from "../helpers/jwt.js";
import { crearAdministradorService, loginService } from "../services/auth.js";

export const crearAdministrador = async (req, res) => {
    try {

        const { nombre, numero_identificacion, nip } = req.body;


        const { status, ok, msg, admin } = await crearAdministradorService(nombre, numero_identificacion, nip);


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

        const { ok, status, msg, token } = await loginService(numero_identificacion, nip);

        res.status(status).json({
            ok,
            msg,
            token
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

        const id_admin = req.id_admin;
        const nombre = req.nombre;

        //Generar un nuevo JWT y retornarlo en esta peticion
        const token = await generarJWT(id_admin, nombre);

        res.json({
            ok: true,
            id_admin, nombre,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}