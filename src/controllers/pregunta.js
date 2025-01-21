import { crearPreguntaService, editarPreguntaService, eliminarPreguntaService } from "../services/pregunta.js";

export const crearPregunta = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id_examen } = req.query;
        const { contenido } = req.body;
        const imagen = req.file;

        const { status, ok, msg, pregunta } = await crearPreguntaService(id_examen, contenido, imagen);

        res.status(status).json({
            ok,
            msg,
            pregunta
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const editarPregunta = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id } = req.params;
        const { contenido } = req.body;
        const imagen = req.file;
        if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})


        const { status, ok, msg } = await editarPreguntaService(id, contenido, imagen);

        res.status(status).json({
            ok,
            msg,
            pregunta
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const eliminarPregunta = async (req, res) => {

    const { id } = req.params;
    if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})

    try {

        const { status, ok, msg } = await eliminarPreguntaService(id);

        res.status(status).json({
            ok,
            msg
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}