import { col, fn, literal } from "sequelize";
import { Examen, Intento_examen, Opcion, Pregunta, Respuesta } from "../models/asociaciones.js"

export const obtenerResultadosService = async (numero_cuenta) => {
    let resultados = {};
    let historialExamenes = {};

    try {
        //Obtener el historial de examenes del estudiante
        historialExamenes = await Intento_examen.findAll({
            attributes: [
                [col("Examen.nombre"), "nombre"],
                [col("Examen.id_examen"), "id_examen"],
                [col("Examen.area"), "area"],
                [col("Intento_examen.fecha_aplicacion"), "fecha_aplicacion"],
                [col("Intento_examen.calificacion"), "calificacion"],
                [
                    literal(`(
                        SELECT COUNT(*)
                        FROM Intento_examen AS i
                        WHERE i.numero_cuenta = Intento_examen.numero_cuenta
                        AND i.id_examen = Intento_examen.id_examen
                        AND i.fecha_aplicacion < Intento_examen.fecha_aplicacion
                        OR (i.fecha_aplicacion = Intento_examen.fecha_aplicacion AND i.id_intento < Intento_examen.id_intento)
                    ) + 1`),
                    "intento"
                ],
                [
                    literal(`CASE 
                        WHEN Intento_examen.calificacion >= 70 THEN 'Aprobado' 
                        ELSE 'Reprobado' 
                    END`),
                    "estado"
                ]
            ],
            include: [
                {
                    model: Examen,
                    attributes: [],
                }
            ],
            where: {
                numero_cuenta
            },
            group: [
                "Examen.nombre",
                "Examen.area",
                "Intento_examen.fecha_aplicacion",
                "Intento_examen.numero_cuenta",
                "Intento_examen.id_examen",
                "Intento_examen.id_intento"
            ],
            order: [["fecha_aplicacion", "DESC"], ["id_intento", "DESC"]] // Ordenar cronológicamente y por ID
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
                    attributes: ["id_opcion", "contenido", "es_correcta"]
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
                attributes: ["id_opcion", "contenido", "id_pregunta", "es_correcta"]
            }
        });

        // Convertir respuestas en un objeto { id_pregunta: contenido_opcion }
        const respuestasMap = respuestas.reduce((acc, respuesta) => {
            acc[respuesta.opcion.id_pregunta] = {
                contenido: respuesta.opcion.contenido,
                es_correcta: respuesta.opcion.es_correcta
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
                opcion_escogida: opcionEscogida.contenido,
                opcion_escogida_correcta: respuestaUsuario ? respuestaUsuario.contenido === (opcionCorrecta ? opcionCorrecta.contenido : null) : false, // ✅ Comparación correcta
                opcion_correcta: opcionCorrecta ? opcionCorrecta.contenido : "No hay opción correcta"
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
            currentPage: parseInt(page)
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