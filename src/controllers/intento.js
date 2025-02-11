import { crearIntentoService, obtenerIntentoPorIdService, actualizarIntentoService } from "../services/intento.js";

export const crearIntento = async(req, res) => {

    const { numero_cuenta, id_examen } = req.query

    try {
        const { status, ok, msg, intento } = await crearIntentoService(numero_cuenta, id_examen);

        res.status(status).json({
            ok, 
            msg,
            intento
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const obtenerIntentoPorId = async(req, res) => {

    const { id } = req.params

    try {
        const { status, ok, msg, intento } = await obtenerIntentoPorIdService(id);

        res.status(status).json({
            ok, 
            msg,
            intento
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const actualizarIntento = async(req, res) => {

    const { id } = req.params
    const { calificacion } = req.query;

    try {
        const { status, ok, msg, intento } = await actualizarIntentoService(id, calificacion);

        res.status(status).json({
            ok, 
            msg,
            intento
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}