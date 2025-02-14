import { Op, Sequelize } from "sequelize";
import { Intento_examen, Opcion, Pregunta, Respuesta } from "../models/asociaciones.js";
import { eliminarCloudinary, subirCloudinary } from "../uploads/cloudinary.js";
import conexion from "../database/database.js";

export const crearPreguntaService = async (id_examen, orden, contenido, imagen) => {
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
        //verificar que no se repita el orden
        const ordenDisponible = await Pregunta.findOne({ where: { orden, id_examen } });
        if (ordenDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "Ya existe una pregunta con esta enumeración."
            }
        }
        //Crear nueva pregunta
        let pregunta = await Pregunta.create({
            id_examen,
            contenido,
            imagen_url: null,
            orden
        })

        if (imagen) {
            //Declaramos el nombre del folder
            const folder = 'imagenes_preguntas'
            //Subir imagen a cloudinary
            const { url_recurso, public_id } = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Pregunta.update({
                imagen_url: url_recurso,
                public_id_imagen: public_id
            }, {
                where: { id_pregunta: pregunta.id_pregunta }
            })

            pregunta.imagen_url = url_recurso;
            pregunta.public_id_imagen = public_id;
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

export const obtenerPreguntaPorIdService = async (id_pregunta) => {
    try {
        console.log(id_pregunta);
        //Buscamos la pregunta con ese id
        const pregunta = await Pregunta.findOne({
            where: {
                id_pregunta
            },
            include: {
                model: Opcion,
                as: 'opcion',
                where: {
                    id_pregunta,
                }
            }
        });
        if (!pregunta) {
            return {
                ok: false,
                status: 404,
                msg: 'No se encontraron preguntas u opciones en este examen',
                pregunta: null
            }
        }
        return {
            ok: true,
            status: 200,
            msg: null,
            pregunta
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerPreguntaPorOrdenService = async (orden, id_examen) => {
    try {
        //Buscamos la pregunta con ese id
        const pregunta = await Pregunta.findOne({
            where: {
                orden,
                id_examen
            },
            include: {
                model: Opcion,
                as: 'opcion',
                required: false,
                where: {
                    id_pregunta: Sequelize.col('Pregunta.id_pregunta') // Aquí usas el id de la pregunta en el include
                }
            }
        });
        if (!pregunta) {
            return {
                ok: false,
                status: 404,
                msg: 'No se encontraron preguntas u opciones en este examen',
                pregunta: null
            }
        }
        return {
            ok: true,
            status: 200,
            msg: null,
            pregunta
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerPreguntaPorExamenService = async (id_examen) => {
    try {
        //Buscamos la pregunta con ese id
        const preguntas = await Pregunta.findAll({
            where: {
                id_examen
            },
            attributes: ['id_pregunta', 'orden']
        });
        if (!preguntas) {
            return {
                ok: false,
                status: 404,
                msg: 'No se encontraron preguntas u opciones en este examen',
                preguntas: null
            }
        }
        return {
            ok: true,
            status: 200,
            msg: null,
            preguntas
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerPreguntaYRespuestaService = async (id_examen, orden, id_intento) => {
    try {
        //Buscamos la pregunta con ese id
        const pregunta = await Pregunta.findOne({
            where: {
                orden,
                id_examen
            },
            include: [{
                model: Opcion,
                as: 'opcion',
                required: false,
                where: {
                    id_pregunta: Sequelize.col('Pregunta.id_pregunta') // Aquí usas el id de la pregunta en el include
                },
                include: [{
                    model: Respuesta,
                    required: false,
                    include: [{
                        model: Intento_examen,
                        required: false,
                        where: {
                            id_intento
                        },
                        attributes: []
                    }],
                    where: {
                        id_intento
                    }
                }],  
            }]
        });
        console.log(pregunta);
        if (!pregunta) {
            return {
                ok: false,
                status: 404,
                msg: 'No se encontraron preguntas u opciones en este examen',
                pregunta: null
            }
        }
        return {
            ok: true,
            status: 200,
            msg: null,
            pregunta
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const editarPreguntaService = async (id_pregunta, contenido, imagen) => {
    try {
        //Verificamos que la pregunta exista
        const pregunta = await Pregunta.findOne({where: {id_pregunta}})
        console.log(pregunta);

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
        const preguntaActualizada = await Pregunta.update({ contenido }, { where: { id_pregunta } })

        if (imagen) {
            //Eliminamos la imagen anterior
            await eliminarCloudinary(pregunta.public_id_imagen);

            //Declaramos el nombre del folder
            const folder = 'imagenes_preguntas'
            //Subir imagen a cloudinary
            const { url_recurso, public_id } = await subirCloudinary(imagen, folder);
            //Si no hay url
            if (!url_recurso) return { ...result }

            //Agregamos el url al objeto
            await Pregunta.update({
                imagen_url: url_recurso,
                public_id_imagen: public_id
            }, {
                where: { id_pregunta: pregunta.id_pregunta }
            })

            preguntaActualizada.imagen_url = url_recurso;
            preguntaActualizada.public_id_imagen = public_id;
        }
        console.log(preguntaActualizada);
        return {
            ok: true,
            status: 201,
            msg: "Pregunta guardada exitosamente",
            pregunta: preguntaActualizada
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

export const eliminarPreguntaService = async (id_pregunta) => {
    const transaction = await conexion.transaction(); // Crear transacción con tu conexión

    try {
        // Buscar la pregunta
        const pregunta = await Pregunta.findByPk(id_pregunta, { transaction });

        if (!pregunta) {
            return {
                ok: false,
                status: 404,
                msg: 'Esta pregunta no existe',
            };
        }

        // Obtener el examen y orden asociado a la pregunta
        const { id_examen, orden } = pregunta;

        // Buscar las opciones relacionadas
        const opcionesRelacionadas = await Opcion.findAll({ 
            where: { id_pregunta },
            transaction,
        });

        // Eliminar imágenes de Cloudinary asociadas a las opciones
        for (const opcion of opcionesRelacionadas) {
            if (opcion.public_id_imagen) {
                await eliminarCloudinary(opcion.public_id_imagen);
            }
        }

        // Eliminar opciones de la base de datos
        await Opcion.destroy({
            where: { id_pregunta },
            transaction,
        });

        // Eliminar imagen asociada a la pregunta, si existe
        if (pregunta.public_id_imagen) {
            await eliminarCloudinary(pregunta.public_id_imagen);
        }

        // Eliminar la pregunta de la base de datos
        await Pregunta.destroy({
            where: { id_pregunta },
            transaction,
        });

        // Actualizar el orden de las preguntas restantes
        await Pregunta.update(
            { orden: conexion.literal('orden - 1') }, // Restar 1 al orden
            {
                where: {
                    id_examen, // Asegurarse de que es el mismo examen
                    orden: { [conexion.Sequelize.Op.gt]: orden }, // Solo las preguntas con orden mayor
                },
                transaction,
            }
        );

        // Confirmar la transacción
        await transaction.commit();

        return {
            ok: true,
            status: 200,
            msg: 'Pregunta eliminada y orden actualizado exitosamente',
        };
    } catch (error) {
        // Revertir la transacción en caso de error
        if (transaction) await transaction.rollback();
        console.error(error);

        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor',
        };
    }
};

export const eliminarImagenPreguntaService = async (id_pregunta) => {
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
        if (pregunta.public_id_imagen) {
            //Eliminamos la imagen relacionada a la pregunta en cloudinary
            await eliminarCloudinary(pregunta.public_id_imagen);
        }

        await Pregunta.update({
            imagen_url: null,
            public_id_imagen: null
        }, {
            where: {
                id_pregunta
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