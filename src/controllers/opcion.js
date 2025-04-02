import { crearOpcionService, eliminarOpcionService, editarOpcionService, eliminarImagenOpcionService, obtenerOpcionService} from "../services/opcion.js";

export const crearOpcion = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id_pregunta } = req.query;
        const { contenido, es_correcta } = req.body;
        const imagen = req.file;

        const { status, ok, msg, opcion } = await crearOpcionService(id_pregunta, contenido, es_correcta, imagen);

        res.status(status).json({
            ok,
            msg,
            opcion
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const obtenerOpcion = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id } = req.params;

        const { status, ok, msg, opcion } = await obtenerOpcionService(id);

        res.status(status).json({
            ok,
            msg,
            opcion
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const eliminarOpcion = async (req, res) => {

    const { id } = req.params;
    if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})

    try {

        const { status, ok, msg } = await eliminarOpcionService(id);

        res.status(status).json({
            ok,
            msg
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const eliminarImagenOpcion = async (req, res) => {

    const { id } = req.params;
    if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})

    try {

        const { status, ok, msg } = await eliminarImagenOpcionService(id);

        res.status(status).json({
            ok,
            msg
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}

export const editarOpcion = async (req, res) => {
    try {
        //req.body es enviado como data
        const { id } = req.params;
        const { contenido, es_correcta } = req.body;
        const imagen = req.file;
        if(!id) return res.status(400).json({ok: false, msg: 'No hay ID en la peticion'})


        const { status, ok, msg, opcion } = await editarOpcionService(id, contenido, es_correcta, imagen);

        res.status(status).json({
            ok,
            msg,
            opcion
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}