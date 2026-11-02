import pkg from "sequelize";
const { Op } = pkg;
import { Opcion } from "../models/asociaciones.js";
import { eliminarCloudinary, subirCloudinary } from "../uploads/cloudinary.js";

export const crearOpcionService = async (id_pregunta, contenido, es_correcta, imagen) => {
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

        if (imagen) {
            // Declaramos el nombre del folder
            const folder = 'imagenes_opciones';

            try {
                // Subir imagen a Cloudinary
                const { url_recurso, public_id } = await subirCloudinary(imagen, folder);

                // Si no hay URL, devolver un error
                if (!url_recurso) {
                    return {
                        ok: false,
                        status: 500,
                        msg: "Error al subir la imagen: No se recibió una URL válida después de la subida a Cloudinary."
                    };
                }

                // Agregar la URL al objeto
                await Opcion.update({
                    imagen_url: url_recurso,
                    public_id_imagen: public_id
                }, {
                    where: { id_opcion: opcion.id_opcion }
                });

                opcion.imagen_url = url_recurso;
                opcion.public_id_imagen = public_id;

            } catch (error) {
                // Si es error de conexión
                if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
                    return {
                        ok: false,
                        status: 503,
                        msg: "Error de conexión a Cloudinary. Verifica tu conexión a Internet."
                    };
                }
                return {
                    ok: false,
                    status: 500,
                    msg: "Error inesperado al subir la imagen a Cloudinary."
                };
            }
        }


        return {
            ok: true,
            status: 201,
            msg: "Opción guardada exitosamente",
            opcion
        };

    } catch (error) {
        conso|le.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor!!!!'
            
        };
    }
}

export const eliminarOpcionService = async (id_opcion) => {
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

        await Opcion.destroy({ where: { id_opcion } });

        return {
            ok: true,
            status: 201,
            msg: "Opcion eliminada exitosamente",
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerOpcionService = async (id_opcion) => {
    try {
        const opcion = await Opcion.findOne({ where: { id_opcion } });

        if (!opcion) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta opción no existe',
                opcion: null
            }
        }

        return {
            ok: true,
            status: 201,
            msg: "Opción eliminada exitosamente",
            opcion
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor',
            opcion: null
        };
    }
}

export const eliminarImagenOpcionService = async (id_opcion) => {
    try {
        const opcion = await Opcion.findByPk(id_opcion);

        if (!opcion) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta opción no existe'
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
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const editarOpcionService = async (id_opcion, contenido, es_correcta, imagen) => {
    try {
        // Verificamos que la opción exista
        const opcion = await Opcion.findByPk(id_opcion);
        if (!opcion) {
            return {
                ok: false,
                status: 404,
                msg: "Opción no encontrada."
            };
        }

        // Verificar que no haya opciones duplicadas
        const opcionExistente = await Opcion.findOne({
            where: {
                [Op.and]: [
                    { contenido: { [Op.eq]: contenido } }, // Verifica que el contenido sea el mismo
                    { id_pregunta: opcion.id_pregunta }, // Debe pertenecer a la misma pregunta
                    { id_opcion: { [Op.ne]: id_opcion } }, // No debe ser la misma opción
                    { contenido: { [Op.ne]: "" } } // Evita comparar con contenido vacío
                ]
            }
        });

        if (opcionExistente) {
            return {
                ok: false,
                status: 409,
                msg: "La opción ya está guardada en esta pregunta. Por favor, ingresa una opción diferente.",
                opcion: null
            };
        }

        // Actualizar contenido y es_correcta
        await Opcion.update({ contenido, es_correcta }, { where: { id_opcion } });

        if (imagen) {
            try {
                // Eliminar la imagen anterior
                if (opcion.public_id_imagen) {
                    await eliminarCloudinary(opcion.public_id_imagen);
                }

                // Subir nueva imagen a Cloudinary
                const folder = 'imagenes_opciones';
                const { url_recurso, public_id } = await subirCloudinary(imagen, folder);

                if (!url_recurso) {
                    return {
                        ok: false,
                        status: 500,
                        msg: "Error al subir la imagen: No se recibió una URL válida después de la subida a Cloudinary."
                    };
                }

                // Actualizar la opción con la nueva imagen
                await Opcion.update({
                    imagen_url: url_recurso,
                    public_id_imagen: public_id
                }, { where: { id_opcion } });

                opcion.imagen_url = url_recurso;
                opcion.public_id_imagen = public_id;

            } catch (error) {
                if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
                    return {
                        ok: false,
                        status: 503,
                        msg: "Error de conexión a Cloudinary. Verifica tu conexión a Internet."
                    };
                }

                return {
                    ok: false,
                    status: 500,
                    msg: "Error inesperado al subir la imagen a Cloudinary."
                };
            }
        }

        await opcion.reload();

        return {
            ok: true,
            status: 200,
            msg: "Opción actualizada exitosamente.",
            opcion
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: "Error en el servidor."
        };
    }
};
