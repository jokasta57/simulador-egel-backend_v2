import { crearExamenService } from "../services/examen.js";

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