import { crearExamenService, obtenerExamenService, obtenerExamenPorIdService, editarExamenService, obtenerExamenPorCarreraService, editarEstadoExamenService } from "../services/examen.js";

export const crearExamen = async (req, res) => {
    try {
        //req.body es enviado como data
        const { status, ok, msg, examen } = await crearExamenService(req.body);

        res.status(status).json({
            ok,
            msg,
            examen
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const editarExamen = async (req, res) => {
    const {id} = req.params;
    try {
        //req.body es enviado como data
        const { status, ok, msg, examen } = await editarExamenService(req.body, id);

        res.status(status).json({
            ok,
            msg,
            examen
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const editarEstadoExamen = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.query;
    try {
        //req.body es enviado como data
        const { status, ok, msg, examen } = await editarEstadoExamenService(estado, id);

        res.status(status).json({
            ok,
            msg,
            examen
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerExamen = async (req, res) => {
    const {carrera} = req.query;
    try {
        //req.body es enviado como data
        const { status, ok, msg, examenes } = await obtenerExamenService(carrera);

        res.status(status).json({
            ok,
            msg,
            examenes
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerExamenPorCarrera = async (req, res) => {
    const {carrera} = req.query;
    try {
        //req.body es enviado como data
        const { status, ok, msg, examenes } = await obtenerExamenPorCarreraService(carrera);

        res.status(status).json({
            ok,
            msg,
            examenes
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerExamenPorId = async (req, res) => {
    try {
        const { id } = req.params;
        //req.body es enviado como data
        const { status, ok, msg, examen } = await obtenerExamenPorIdService(id);

        res.status(status).json({
            ok,
            msg,
            examen
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}