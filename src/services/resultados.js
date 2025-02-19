import { col, fn, literal } from "sequelize";
import { Examen, Intento_examen, Opcion, Pregunta, Respuesta } from "../models/asociaciones.js"

export const obtenerResultadosService = async (numero_cuenta) => {
    let resultados = {};
    let historialExamenes = {};

    try {
        historialExamenes = await Intento_examen.findAll({
            attributes: [
                [col("Examen.nombre"), "nombre"],
                [col("Examen.id_examen"), "id_examen"],
                [col("Examen.area"), "area"],
                [col("Intento_examen.fecha_aplicacion"), "fecha_aplicacion"],
                [col("Intento_examen.calificacion"), "calificacion"],
                [col("Intento_examen.id_intento"), "id_intento"],
                [
                    literal(`CASE 
                        WHEN Intento_examen.calificacion >= 70 THEN 'Aprobado' 
                        ELSE 'Reprobado' 
                    END`),
                    "estado"
                ]
            ],
            include: [{ model: Examen, attributes: [] }],
            where: { numero_cuenta },
            order: [["id_examen", "ASC"], ["fecha_aplicacion", "ASC"], ["id_intento", "ASC"]]
        });

        // Recalcular intentos manualmente
        const intentosPorExamen = {};
        historialExamenes.forEach((examen) => {
            if (!intentosPorExamen[examen.id_examen]) {
                intentosPorExamen[examen.id_examen] = 1;
            } else {
                intentosPorExamen[examen.id_examen]++;
            }
            examen.setDataValue("intento", intentosPorExamen[examen.id_examen]);
        });





        if (!historialExamenes) {
            return {
                status: 404,
                ok: false,
                msg: 'No hay intentos aún',
                resultados: null,
                historialExamenes: null
            }
        }

        //Obtener promedio general de todos los examenes
        resultados.promedioGeneral = await Intento_examen.findOne({
            attributes: [
                [fn("AVG", col('calificacion')), "promedioGeneral"]
            ],
            where: {
                numero_cuenta
            }
        })

        //Obtener mejor calificacion
        resultados.mejorCalificacion = await Intento_examen.findOne({
            attributes: ["calificacion"],
            include: [
                {
                    model: Examen,
                    attributes: ["nombre"]
                }
            ],
            where: {
                numero_cuenta
            },
            order: [["calificacion", "DESC"]], // Ordenar por calificación descendente
            limit: 1 // Solo obtener el mejor
        });

        //Obtener menor calificacion
        resultados.menorCalificacion = await Intento_examen.findOne({
            attributes: ["calificacion"],
            include: [
                {
                    model: Examen,
                    attributes: ["nombre"]
                }
            ],
            where: {
                numero_cuenta
            },
            order: [["calificacion", "ASC"]], // Ordenar por calificación descendente
            limit: 1 // Solo obtener el mejor
        });

        //Obtener total de intentos totales
        resultados.totalIntentos = historialExamenes.length;


        return {
            status: 200,
            ok: true,
            msg: null,
            resultados,
            historialExamenes
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: null,
            resultados: null,
            historialExamenes: null
        }
    }
}

export const obtenerCalificacionPorIntentoService = async (id_intento) => {

    let respuestas = {}

    try {

        //Obtiene informacion del examen
        const examen = await Intento_examen.findOne({
            include: {
                model: Examen
            },
            where: {
                id_intento
            }
        })

        if (!examen) {
            return {
                status: 404,
                ok: false,
                msg: 'Este intento no existe',
                examen: null,
                respuestas: null
            }
        }
        //obtiene el numero de respuestas correctas
        respuestas.correctas = await Respuesta.count({
            where: {
                id_intento,
                es_correcta: 1
            }
        })
        //obtiene el numero de respuestas incorrectas

        const totalPreguntas = await Pregunta.findAll({ where: { id_examen: examen.id_examen } })

        respuestas.totalPreguntas = totalPreguntas.length;

        respuestas.incorrectas = totalPreguntas.length - respuestas.correctas;

        respuestas.calificacionFinal = (respuestas.correctas / (totalPreguntas.length / 100)).toFixed(2);

        await Intento_examen.update({
            calificacion:
                respuestas.calificacionFinal
        }, {
            where: {
                id_intento
            }
        })



        console.log(respuestas);

        // Genera el mensaje de recomendación según la calificación
        if (respuestas.calificacionFinal >= 90) {
            respuestas.mensaje = "¡Felicidades por tu desempeño!";
        } else if (respuestas.calificacionFinal >= 70) {
            respuestas.mensaje = "Buen trabajo, pero puedes mejorar.";
        } else {
            respuestas.mensaje = "Es recomendable repasar los temas y volver a intentarlo.";
        }

        return {
            status: 200,
            ok: true,
            msg: null,
            examen,
            respuestas
        }

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: null,
            examen: null,
            respuestas: null
        }
    }
}

export const obtenerRevisionPorIntentoService = async (id_intento, page, limit) => {

    let respuestas = {}

    try {
        const offset = (page - 1) * limit;

        //Obtiene informacion del examen
        const intento = await Intento_examen.findOne({
            include: {
                model: Examen
            },
            where: {
                id_intento
            }
        })

        let numeroIntento = await Intento_examen.findAll({
            attributes: ['id_intento'],
            where: { id_examen: intento.examen.id_examen }
        })

        if (!intento) {
            return {
                status: 404,
                ok: false,
                msg: 'Este intento no existe'
            }
        }

        const preguntas = await Pregunta.findAll({
            where: { id_examen: intento.id_examen },
            include: [
                {
                    model: Opcion,
                    as: "opcion",
                    attributes: ["id_opcion", "contenido", "es_correcta", 'imagen_url']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            orden: [["orden", "DESC"]]
        });

        const totalPreguntas = await Pregunta.count({ where: { id_examen: intento.id_examen } });

        // Obtener respuestas del usuario para el intento de examen
        const respuestas = await Respuesta.findAll({
            where: { id_intento },
            include: {
                model: Opcion, // Para obtener el contenido de la opción seleccionada
                attributes: ["id_opcion", "contenido", "id_pregunta", "es_correcta", 'imagen_url']
            }
        });

        // Convertir respuestas en un objeto { id_pregunta: contenido_opcion }
        const respuestasMap = respuestas.reduce((acc, respuesta) => {
            acc[respuesta.opcion.id_pregunta] = {
                contenido: respuesta.opcion.contenido,
                es_correcta: respuesta.opcion.es_correcta,
                imagen_url: respuesta.opcion.imagen_url
            };
            return acc;
        }, {});

        // Formatear preguntas con la opción correcta y la respuesta del usuario
        const formattedQuestions = preguntas.map((pregunta) => {
            // Encuentra la opción correcta
            const opcionCorrecta = pregunta.opcion.find((op) => op.es_correcta === true);

            // Encuentra la opción seleccionada por el usuario
            const respuestaUsuario = respuestasMap[pregunta.id_pregunta];

            // Encuentra la opción seleccionada por el usuario
            const opcionEscogida = respuestasMap[pregunta.id_pregunta] || "No respondida";

            return {
                id_pregunta: pregunta.id_pregunta,
                contenido: pregunta.contenido,
                imagen_url: pregunta.imagen_url,
                orden: pregunta.orden,
                opcion_escogida: opcionEscogida.contenido,
                opcion_escogida_imagen: respuestaUsuario ? respuestaUsuario.imagen_url : null,
                opcion_escogida_correcta: respuestaUsuario ? respuestaUsuario.contenido === (opcionCorrecta ? opcionCorrecta.contenido : null) : false, // ✅ Comparación correcta
                opcion_correcta: opcionCorrecta ? opcionCorrecta.contenido : "No hay opción correcta",
                opcion_correcta_imagen: opcionCorrecta ? opcionCorrecta.imagen_url : null
            };
        });

        return {
            status: 200,
            ok: true,
            intento,
            examen: intento.Examen,
            preguntas: formattedQuestions,
            totalPreguntas,
            totalPages: Math.ceil(totalPreguntas / limit),
            currentPage: parseInt(page),
            numeroIntento: numeroIntento.length,
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: null,
            examen: null,
            respuestas: null
        }
    }
}

export const obtenerPreguntasParaPanelService = async (id_intento) => {
    try {
        const intento = await Intento_examen.findOne({ where: { id_intento } });

        if (!intento) return { status: 404, ok: false, msg: 'Intento no encontrado', preguntasPanel: null }
        //Seccion de panel
        const preguntasPanel = await Pregunta.findAll({
            attributes: ["id_pregunta", "orden"], // Solo lo necesario para el panel
            where: { id_examen: intento.id_examen },
            include: [
                {
                    model: Opcion,
                    as: "opcion", // Usa el alias definido en las asociaciones
                    attributes: ["id_opcion"]
                }
            ],
            order: [["orden", "ASC"]]
        });


        // Obtener todas las respuestas del usuario para el intento
        const respuestasUsuario = await Respuesta.findAll({
            where: { id_intento },
            attributes: ["id_opcion"], // Solo necesitamos la opción elegida
            include: [
                {
                    model: Opcion,
                    attributes: ["id_opcion", "es_correcta"], // Verificar si la opción era correcta
                }
            ]
        });

        // Convertir respuestas en un Map para búsqueda rápida
        const respuestasMapeado = new Map();
        respuestasUsuario.forEach(res => {
            respuestasMapeado.set(res.id_opcion, res.opcion.es_correcta);
        });

        // Formatear la respuesta del panel
        const panelFormatted = preguntasPanel.map((pregunta) => {
            // Verificar si alguna opción fue respondida
            const opcionRespondida = pregunta.opcion.find(op => respuestasMapeado.has(op.id_opcion));

            return {
                id_pregunta: pregunta.id_pregunta,
                orden: pregunta.orden,
                es_correcta: opcionRespondida ? respuestasMapeado.get(opcionRespondida.id_opcion) : false // Correcta o No respondida
            };
        });

        return {
            status: 200,
            ok: true,
            msg: null,
            preguntasPanel: panelFormatted
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: 'Error en el servidor'
        }
    }
}