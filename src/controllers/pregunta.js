import { crearPreguntaService, editarPreguntaService, eliminarPreguntaService, obtenerPreguntaYRespuestaService, eliminarImagenPreguntaService, obtenerPreguntaPorIdService, obtenerPreguntaPorOrdenService, obtenerPreguntaPorExamenService } from "../services/pregunta.js";

export const crearPregunta = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id_examen, orden } = req.query;
        const { contenido } = req.body;
        const imagen = req.file;

        const { status, ok, msg, pregunta } = await crearPreguntaService(id_examen, orden, contenido, imagen);

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

export const obtenerPreguntaPorId = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id } = req.params;

        const { status, ok, msg, pregunta } = await obtenerPreguntaPorIdService(id);

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

export const obtenerPreguntaPorOrden = async (req, res) => {
    try {
        //req.body es enviado como data
        const { orden, id_examen } = req.query;

        const { status, ok, msg, pregunta } = await obtenerPreguntaPorOrdenService(orden, id_examen);

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
export const obtenerPreguntaPorExamen = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id } = req.params;

        const { status, ok, msg, preguntas } = await obtenerPreguntaPorExamenService(id);

        res.status(status).json({
            ok,
            msg,
            preguntas
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerPreguntaYRespuesta = async (req, res) => {
    try {
        const {id_intento} = req.params;
        //req.body es enviado como data
        const { id_examen, orden } = req.query;

        console.log(id_examen, orden);

        const { status, ok, msg, pregunta } = await obtenerPreguntaYRespuestaService(id_examen, orden, id_intento);

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


        const { status, ok, msg, pregunta } = await editarPreguntaService(id, contenido, imagen);

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

export const eliminarImagenPregunta = async (req, res) => {
    //req.body es enviado como data
    const { id } = req.params;
    if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})
    
    try {

        const { status, ok, msg } = await eliminarImagenPreguntaService(id);

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