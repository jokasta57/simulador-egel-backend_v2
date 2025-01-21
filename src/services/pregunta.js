import { Op } from "sequelize";
import { Pregunta } from "../models/asosiaciones.js";
import { eliminarCloudinary, subirCloudinary } from "../uploads/cloudinary.js";

export const crearPreguntaService = async(id_examen, contenido, imagen) => {
    try {
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

export const editarPreguntaService = async(id_pregunta, contenido, imagen) => {
    try {
        //Verificamos que la pregunta exista
        const pregunta = await Pregunta.findByPk(id_pregunta)

        //Verificar que no haya preguntas duplicadas
        const preguntaDisponible = await Pregunta.findOne({ 
            where: { 
                contenido, 
                id_examen: pregunta.id_examen,
                id_pregunta: { [Op.ne]: id_pregunta } // Asegura que no sea la misma pregunta
            } 
        });

        if (preguntaDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "La pregunta ya existe en este examen. Por favor, ingresa una pregunta diferente."
            }
        }
        //Actualizar pregunta
        await Pregunta.update({contenido}, {where: {id_pregunta}})

        if(imagen) {
            //Eliminamos la imagen anterior
            await eliminarCloudinary(pregunta.imagen_url);

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
            msg: "Pregunta guardada exitosamente"
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

export const eliminarPreguntaService = async(id_pregunta) => {
    try {
        const pregunta = await Pregunta.findByPk(id_pregunta);

        if (!pregunta) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta pregunta no existe'
            }
        }

        //Revisamos si hay alguna imagen vinculada
        if(pregunta.imagen_url){
            //Eliminamos la imagen relacionada a la pregunta en cloudinary
            await eliminarCloudinary(pregunta.imagen_url);
        }

        await Pregunta.destroy({ where: { id_pregunta }});

        return {
            ok: true, 
            status: 201,
            msg: "Pregunta eliminada exitosamente",
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