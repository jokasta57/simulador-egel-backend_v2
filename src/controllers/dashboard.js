import { obtenerPorcentajeAprobadoService, obtenerPorcentajeFechasService, obtenerBorradoresService, obtenerRendimientoPorPreguntaService } from "../services/dashboard.js";


export const obtenerPorcentajeAprobados = async(req, res) => {
    const { carrera } = req.query
    try {
        const { status, ok , msg, historialAprobados, porcentajes, datosInicio } = await obtenerPorcentajeAprobadoService(carrera)

        res.status(status).json({
            ok,
            msg,
            historialAprobados,
            porcentajes,
            datosInicio
        })
    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const obtenerPorcentajeFechas = async(req, res) => {
    const { carrera } = req.query
    try {
        const { status, ok , msg, porcentajesPorFecha  } = await obtenerPorcentajeFechasService(carrera)

        res.status(status).json({
            ok,
            msg,
            porcentajesPorFecha 
        })
    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const obtenerBorradores = async(req, res) => {
    const { carrera } = req.query
    try {
        const { status, ok , msg, borradores  } = await obtenerBorradoresService(carrera)

        res.status(status).json({
            ok,
            msg,
            borradores 
        })
    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}

export const obtenerRendimientoPorPregunta = async(req, res) => {
    const { fechaInicio, fechaFin } = req.query
    const { id_examen } = req.params
    try {
        const { status, ok , msg, intentos  } = await obtenerRendimientoPorPreguntaService(id_examen , fechaInicio, fechaFin)

        res.status(status).json({
            ok,
            msg,
            intentos 
        })
    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: false,
            msg: 'Error en el servidor'
        })
    }
}