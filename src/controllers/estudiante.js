import { crearEstudianteService, loginEstudianteService, obtenerInfoDelEstudianteService } from "../services/estudiante.js";

export const crearEstudiante = async (req, res) => {
    try {
        //req.body es enviado como data
        const { status, ok, msg, estudiante } = await crearEstudianteService(req.body);

        res.status(status).json({
            ok,
            msg,
            estudiante
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const loginEstudiante = async (req, res) => {
    try {

        const { numero_cuenta, nip } = req.body;

        const { ok, status, msg, token, estudiante } = await loginEstudianteService(numero_cuenta, nip);

        res.status(status).json({
            ok,
            msg,
            token,
            estudiante
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const obtenerInfoDelEstudiante = async (req, res) => {
    try {

        const { id } = req.params;

        const { ok, status, msg, estudiante } = await obtenerInfoDelEstudianteService(id);

        res.status(status).json({
            ok,
            msg,
            estudiante
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}