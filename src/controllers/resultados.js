import { obtenerResultadosService } from "../services/resultados.js";

export const obtenerResultados = async (req, res) => {
    const { id } = req.params;

    try {
        
        const { status, ok, msg, resultados, historialExamenes } = await obtenerResultadosService( id );

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