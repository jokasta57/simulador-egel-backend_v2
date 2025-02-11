import { crearRespuestaService, obtenerRespuestaPorIdService, actualizarRespuestaService } from "../services/respuesta.js";

export const crearRespuesta = async(req, res) => {

    const { id_intento, id_opcion } = req.query;

    try {

        const { status, ok, msg, respuesta } = await crearRespuestaService(id_intento, id_opcion);

        res.status(status).json({
            ok,
            msg,
            respuesta
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const obtenerRespuestaPorId = async(req, res) => {

    const { id } = req.params;

    try {

        const { status, ok, msg, respuesta } = await obtenerRespuestaPorIdService(id);

        res.status(status).json({
            ok,
            msg,
            respuesta
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const actualizarRespuesta = async(req, res) => {

    const { id } = req.params;
    const { id_opcion } = req.query;


    try {

        const { status, ok, msg, respuesta } = await actualizarRespuestaService(id, id_opcion);

        res.status(status).json({
            ok,
            msg,
            respuesta
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}