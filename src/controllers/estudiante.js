import { crearEstudianteService, loginEstudianteService } from "../services/estudiante.js";

export const crearEstudiante = async (req, res) => {
    try {
        //req.body es enviado como data
        const { status, ok, msg, admin } = await crearEstudianteService(req.body);

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

export const loginEstudiante = async (req, res) => {
    try {

        const { numero_cuenta, nip } = req.body;

        const { ok, status, msg, token } = await loginEstudianteService(numero_cuenta, nip);

        res.status(status).json({
            ok,
            msg,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}