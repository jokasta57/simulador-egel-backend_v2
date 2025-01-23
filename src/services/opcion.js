import { Op } from "sequelize";
import { Opcion } from "../models/asociaciones.js";
import { eliminarCloudinary, subirCloudinary } from "../uploads/cloudinary.js";

export const crearOpcionService = async(id_pregunta, contenido, es_correcta, imagen) => {
    try {
        //Verificar que no haya preguntas duplicadas
        const opcionDisponible = await Opcion.findOne({ where: { contenido, id_pregunta } });
        if (opcionDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "La opcion ya está guardada en esta pregunta. Por favor, ingresa una opción diferente."
            }
        }
        //Crear nueva pregunta
        let opcion = await Opcion.create({
            id_pregunta, 
            contenido,
            es_correcta, 
            imagen_url: null
        })

        if(imagen) {
            //Declaramos el nombre del folder
            const folder = 'imagenes_opciones'
            //Subir imagen a cloudinary
            const result = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!result.url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Opcion.update({
                imagen_url: result.url_recurso
            }, {
                where: { id_opcion: opcion.id_opcion}
            })

            opcion.imagen_url = result.url_recurso;
        }

        return {
            ok: true, 
            status: 201,
            msg: "Opción guardada exitosamente",
            opcion
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