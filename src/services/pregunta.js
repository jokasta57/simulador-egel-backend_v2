import { Pregunta } from "../models/asosiaciones.js";
import { subirCloudinary } from "../uploads/cloudinary.js";

export const crearPreguntaService = async(id_examen, contenido, imagen) => {
    try {
        console.log(imagen);
        //Verificar que no haya preguntas duplicadas
        const preguntaDisponible = await Pregunta.findOne({ where: { contenido, id_examen } });
        if (preguntaDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "La pregunta ya existe en este examen. Por favor, ingresa una pregunta diferente."
            }
        }
        //Crear nueva pregunta
        let pregunta = await Pregunta.create({
            id_examen, 
            contenido, 
            imagen_url: null
        })

        if(imagen) {
            //Declaramos el nombre del folder
            const folder = 'imagenes_preguntas'
            //Subir imagen a cloudinary
            const result = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!result.url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Pregunta.update({
                imagen_url: result.url_recurso
            }, {
                where: { id_pregunta: pregunta.id_pregunta}
            })

            pregunta.imagen_url = result.url_recurso;
        }

        return {
            ok: true, 
            status: 201,
            msg: "Pregunta guardada exitosamente",
            pregunta
        };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}