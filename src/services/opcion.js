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
            const {url_recurso, public_id } = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Opcion.update({
                imagen_url: url_recurso,
                public_id_imagen: public_id
            }, {
                where: { id_opcion: opcion.id_opcion}
            })

            opcion.imagen_url = url_recurso;
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

export const eliminarOpcionService = async(id_opcion) => {
    try {
        const opcion = await Opcion.findByPk(id_opcion);

        if (!opcion) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta opcion no existe'
            }
        }

         //Revisamos si hay alguna imagen vinculada
         if (opcion.public_id_imagen) {
            //Eliminamos la imagen relacionada a la pregunta en cloudinary
            await eliminarCloudinary(opcion.public_id_imagen);
        }

        await Opcion.destroy({ where: { id_opcion }});

        return {
            ok: true, 
            status: 201,
            msg: "Opcion eliminada exitosamente",
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

export const eliminarImagenOpcionService = async(id_opcion) => {
    try {
        const opcion = await Opcion.findByPk(id_opcion);

        if (!opcion) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta opcion no existe'
            }
        }

         //Revisamos si hay alguna imagen vinculada
         if (opcion.public_id_imagen) {
            //Eliminamos la imagen relacionada a la pregunta en cloudinary
            await eliminarCloudinary(opcion.public_id_imagen);
        }

        await Opcion.update({
            imagen_url: null, 
            public_id_imagen: null
        }, { 
            where: { 
                id_opcion 
            }
        });

        return {
            ok: true, 
            status: 201,
            msg: "Imagen eliminada exitosamente",
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

export const editarOpcionService = async (id_opcion, contenido, es_correcta, imagen) => {
    try {
        //Verificamos que la pregunta exista
        const opcion = await Opcion.findByPk(id_opcion)

        //Verificar que no haya preguntas duplicadas
        const opcionExistente = await Opcion.findOne({
            where:  {
                [Op.and]: [
                    { contenido: { [Op.eq]: contenido } }, // Verifica que el contenido sea el mismo
                    { id_pregunta: opcion.id_pregunta }, // Debe pertenecer a la misma pregunta
                    { id_opcion: { [Op.ne]: id_opcion } }, // No debe ser la misma opción
                    { contenido: { [Op.ne]: "" } } // Evita que compare con contenido vacío
                ]
            }
        });
        console.log(opcionExistente);

        //Revisa el duplicado
        if (opcionExistente) {
            return {
                ok: false,
                status: 409,
                msg: "La opcion ya está guardada en esta pregunta. Por favor, ingresa una opción diferente.",
                opcion: null
            }
        }
        //Actualizar pregunta
        await Opcion.update({ contenido, es_correcta }, { where: { id_opcion } })

        if (imagen) {
            //Eliminamos la imagen anterior
            await eliminarCloudinary(opcion.public_id_imagen);

            //Declaramos el nombre del folder
            const folder = 'imagenes_opciones'
            //Subir imagen a cloudinary
            const {url_recurso, public_id } = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Opcion.update({
                imagen_url: url_recurso,
                public_id_imagen: public_id
            }, {
                where: { id_opcion: opcion.id_opcion}
            })

            opcion.imagen_url = url_recurso;
            opcion.public_id_imagen = public_id;
        }

        return {
            ok: true,
            status: 201,
            msg: "Opcion actualizada exitosamente",
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