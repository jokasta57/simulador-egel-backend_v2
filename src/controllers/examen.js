import { crearExamenService, obtenerExamenService, obtenerExamenPorIdService, editarExamenService } from "../services/examen.js";

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
        console.log(error);
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
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerExamen = async (req, res) => {
    try {
        //req.body es enviado como data
        const { status, ok, msg, examenes } = await obtenerExamenService();

        res.status(status).json({
            ok,
            msg,
            examenes
        })

    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}