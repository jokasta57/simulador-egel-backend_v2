import { Intento_examen, Opcion, Respuesta } from "../models/asociaciones.js"

export const crearRespuestaService = async(id_intento, id_opcion) => {
    try {
        
        const intentoExistente = await Intento_examen.findOne({where: { id_intento }});

        if(!intentoExistente) {
            return {
                status: 404,
                ok: false,
                msg: "ID del intento no encontrado"
            }
        }

        const opcion = await Opcion.findOne({where: { id_opcion }});

        if(!opcion){
            return {
                status: 404,
                ok: false,
                msg: "ID de la opción no encontrado"
            }
        }

        const respuesta = await Respuesta.create({
            id_opcion,
            id_intento,
            es_correcta: opcion.es_correcta
        })

        return {
            status: 201,
            ok: true,
            msg: "Respuesta guardada exitosamente",
            respuesta
        }

    } catch (error) {
        return {
            status: 500,
            ok: false,
            msg: "Error en el servidor",
            respuesta: null
        }
    }
}