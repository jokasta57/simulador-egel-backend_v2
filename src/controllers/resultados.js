import { obtenerCalificacionPorIntentoService, obtenerResultadosService, obtenerRevisionPorIntentoService } from "../services/resultados.js";

export const obtenerResultados = async (req, res) => {
    const { id } = req.params;

    try {

        const { status, ok, msg, resultados, historialExamenes } = await obtenerResultadosService(id);

        res.status(status).json({
            ok,
            msg,
            resultados,
            historialExamenes
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const obtenerCalificacionPorIntento = async (req, res) => {
    const id_intento = req.params.id;

    try {

        const { status, ok, msg, examen, respuestas } = await obtenerCalificacionPorIntentoService(id_intento);

        res.status(status).json({
            ok,
            msg,
            examen,
            respuestas
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const obtenerRevisionPorIntento = async (req, res) => {

    const { id_intento } = req.params;
    const { page = 1, limit = 5 } = req.query; // Parámetros de paginación

    try {

        const { status, ok, msg, intento, examen, preguntas, totalPreguntas, totalPages, currentPage} = await obtenerRevisionPorIntentoService(id_intento, page, limit);

        res.status(status).json({
            ok,
            msg,
            intento, 
            examen, 
            preguntas, 
            totalPreguntas,
            totalPages, 
            currentPage
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}