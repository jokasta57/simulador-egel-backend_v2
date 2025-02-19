import { obtenerPorcentajeAprobadoService, obtenerPorcentajeFechasService } from "../services/dashboard.js";


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