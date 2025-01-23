import { crearOpcionService } from "../services/opcion.js";

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
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        })
    }
}