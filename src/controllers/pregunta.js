import { crearPreguntaService } from "../services/pregunta.js";

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