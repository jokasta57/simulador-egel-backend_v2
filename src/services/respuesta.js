import { Intento_examen, Opcion, Pregunta, Respuesta } from "../models/asociaciones.js"

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

export const obtenerRespuestaPorIdService = async(id_respuesta) => {
    try {
        const respuesta = await Respuesta.findOne({
            where: {
                id_respuesta
            },
            attributes: ['id_respuesta', 'id_opcion'],
            include: {
                model: Opcion,
                attributes: ['id_opcion','imagen_url', 'contenido'],
                include: {
                    model: Pregunta,
                    as: 'pregunta',
                    attributes: ['id_pregunta', 'contenido','imagen_url', 'orden']
                }
            }
        });

        if(!respuesta) {
            return {
                status: 404,
                ok: false,
                msg: "No existe una respuesta con ese ID",
                respuesta: null
            }
        }

        return {
            status: 201,
            ok: true,
            msg: null,
            respuesta
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: "Error en el servidor",
            respuesta: null
        }
    }
}


export const actualizarRespuestaService = async(id_respuesta, id_opcion) => {
    try {
        
        let respuesta = await Respuesta.findOne({where: {id_respuesta}})

        if(!respuesta) {
            return {
                status: 404,
                ok: false,
                msg: "No existe una respuesta con ese ID",
                respuesta: null
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

        respuesta = await Respuesta.update({id_opcion}, { where: {id_respuesta}})

        return {
            status: 201,
            ok: true,
            msg: "Respuesta guardada exitosamente",
            respuesta
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: "Error en el servidor",
            respuesta: null
        }
    }
}