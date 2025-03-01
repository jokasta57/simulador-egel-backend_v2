import { Op, Sequelize } from "sequelize"
import { Estudiante, Examen, Intento_examen, Opcion, Pregunta, Respuesta } from "../models/asociaciones.js"

export const obtenerPorcentajeAprobadoService = async (carrera) => {
    let datosInicio = {}
    let historialAprobados = {}
    let porcentajes = {}
    try {
        //Numero de examenes
        const examenes = await Examen.findAll({ where: { carrera } });
        if (!examenes) return {
            status: 404,
            ok: false,
            historialAprobados: null,
            porcentajeAprobados: null,
            datosInicio: null
        }
        datosInicio.totalExamenes = examenes.length;

        //Numero de estudiantes
        const estudiantes = await Estudiante.findAll({ where: { carrera } })

        if (!estudiantes) datosInicio.estudiantesRegistrados = 0;
        datosInicio.estudiantesRegistrados = estudiantes.length;

        //Ultimo examen aplicado
        const ultimoIntento = await Intento_examen.findOne({
            include: [{
                model: Examen,
                attributes: ['nombre'],
                where: { carrera }
            }],
            order: [["fecha_aplicacion", 'DESC']]
        })

        datosInicio.ultimoExamen = ultimoIntento;


        //Porcentaje de aprobados
        const totalIntentos = await Intento_examen.count({
            include: [{
                model: Examen,
                attributes: [],
                where: { carrera }
            }],
        });

        const totalAprobados = await Intento_examen.count({
            include: [{
                model: Examen,
                attributes: [],
                where: { carrera }
            }],
            where: {
                calificacion: { [Op.gte]: 70 } // Calificación mayor o igual a 70
            }
        });

        const totalReprobados = totalIntentos - totalAprobados; // Los restantes son reprobados

        porcentajes.aprobados = (totalIntentos > 0 ? (totalAprobados / totalIntentos) * 100 : 0).toFixed(2);
        porcentajes.reprobados = (totalIntentos > 0 ? (totalReprobados / totalIntentos) * 100 : 0).toFixed(2);

        return {
            status: 200,
            ok: true,
            msg: null,
            historialAprobados,
            porcentajes,
            datosInicio
        }



    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            historialAprobados: null,
            porcentajeAprobados: null,
            datosInicio: null
        }
    }
}

export const obtenerPorcentajeFechasService = async (carrera) => {
    try {
        const resultadosPorFecha = await Intento_examen.findAll({
            attributes: [
                "fecha_aplicacion",
                [Sequelize.fn("COUNT", Sequelize.col("id_intento")), "total_intentos"],
                [Sequelize.fn("SUM", Sequelize.literal("CASE WHEN calificacion >= 70 THEN 1 ELSE 0 END")), "total_aprobados"],
                [Sequelize.col('Examen.nombre'), 'nombre']
            ],
            include: [{
                model: Examen,
                attributes: [],
                where: { carrera }
            }],
            group: ["fecha_aplicacion", 'Examen.nombre'],
            order: [["fecha_aplicacion", "ASC"]]
        });

        // Agrupar por fecha y calcular el porcentaje correctamente
        const dataAgrupada = {};

        resultadosPorFecha.forEach(row => {
            const fecha = row.dataValues.fecha_aplicacion;
            const totalIntentos = parseInt(row.dataValues.total_intentos, 10) || 0;
            const totalAprobados = parseInt(row.dataValues.total_aprobados, 10) || 0;
            const nombre = row.dataValues.nombre;

            if (!dataAgrupada[fecha]) {
                dataAgrupada[fecha] = {
                    nombre: new Set(), // Usamos un Set para manejar múltiples nombres de exámenes
                    totalIntentos: 0,
                    totalAprobados: 0
                };
            }

            dataAgrupada[fecha].nombre.add(nombre); // Agregar el nombre del examen al Set
            dataAgrupada[fecha].totalIntentos += totalIntentos;
            dataAgrupada[fecha].totalAprobados += totalAprobados;
        });

        // Calcular el porcentaje correctamente
        const porcentajesPorFecha = Object.entries(dataAgrupada).map(([fecha, datos]) => ({
            fecha,
            nombre: [...datos.nombre].join(", "), // Convertimos el Set en un string con los nombres de los exámenes
            porcentajeAprobados: datos.totalIntentos > 0
                ? ((datos.totalAprobados / datos.totalIntentos) * 100).toFixed(2) // Cálculo correcto del porcentaje
                : "0.00",
            totalIntentos: datos.totalIntentos
        }));

        return {
            status: 200,
            ok: true,
            msg: null,
            porcentajesPorFecha
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            porcentajesPorFecha: null
        };
    }
};

export const obtenerBorradoresService = async (carrera) => {
    try {

        const borradores = await Examen.findAll({
            where: {
                carrera,
                estado: 'borrador'
            }
        })

        if (!borradores) return {
            status: 404,
            ok: false,
            msg: 'No hay borradores disponibles'
        }

        return {
            status: 200,
            ok: true,
            msg: null,
            borradores
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            borradores: null
        };
    }
};

export const obtenerRendimientoPorPreguntaService = async (id_examen, fechaInicio, fechaFin) => {   
    try {
        console.log(fechaInicio, fechaFin);

        // Construir condición opcional de fechas
        let whereCondition = { id_examen };
        
        if (fechaInicio && fechaFin) {
            whereCondition.fecha_aplicacion = { [Op.between]: [fechaInicio, fechaFin] };
        } else if (fechaInicio) {
            whereCondition.fecha_aplicacion = { [Op.gte]: fechaInicio };
        } else if (fechaFin) {
            whereCondition.fecha_aplicacion = { [Op.lte]: fechaFin };
        }

        let intentos = await Intento_examen.findAll({
            include: [{
                model: Examen,
                where: { id_examen },
                attributes: [],
            }, {
                model: Respuesta,
                include: [{
                    model: Opcion,
                    as: 'opcion',
                    attributes: ['id_opcion', 'contenido', 'imagen_url', 'es_correcta'],
                    include: [{
                        model: Pregunta,
                        as: 'pregunta',
                        attributes: ['id_pregunta', 'contenido', 'imagen_url', 'orden'],
                    }]
                }]

            }],
            attributes: ['fecha_aplicacion', 'calificacion', 'id_intento'],
            where: whereCondition
        })
        // Objeto para almacenar los aciertos por pregunta
        let rendimientoPreguntas = {};

        // Procesar datos
        intentos.forEach(intento => {
            let respuestas = intento.respuesta || [];

            respuestas.forEach(r => {
                let pregunta = r.opcion.pregunta;
                let id_pregunta = pregunta.id_pregunta;
                let orden = pregunta.orden;
                let id_opcion = r.opcion.id_opcion;
                let contenido_opcion = r.opcion.contenido;
        
                if (!rendimientoPreguntas[id_pregunta]) {
                    rendimientoPreguntas[id_pregunta] = {
                        pregunta: orden,
                        porcentaje_aciertos: 0,
                        texto_pregunta: pregunta.contenido,
                        opciones: {}
                    };
                }
        
                // Registrar opción si no existe
                if (!rendimientoPreguntas[id_pregunta].opciones[id_opcion]) {
                    rendimientoPreguntas[id_pregunta].opciones[id_opcion] = {
                        opcion: Object.keys(rendimientoPreguntas[id_pregunta].opciones).length + 1, // A, B, C, D...
                        texto: contenido_opcion,
                        frecuencia: 0
                    };
                }
        
                // Aumentar la frecuencia de la opción seleccionada
                rendimientoPreguntas[id_pregunta].opciones[id_opcion].frecuencia++;
        
                // Contar respuestas correctas
                if (r.es_correcta) {
                    rendimientoPreguntas[id_pregunta].porcentaje_aciertos++;
                }
            });
        });
        
        // Convertir el objeto en un array y calcular los porcentajes finales
        let rendimientoPreguntasArray = Object.values(rendimientoPreguntas).map(pregunta => {
            let totalRespuestas = Object.values(pregunta.opciones).reduce((sum, opcion) => sum + opcion.frecuencia, 0);
            let porcentajeAciertos = totalRespuestas > 0 ? (pregunta.porcentaje_aciertos / totalRespuestas) : 0;
        
            return {
                pregunta: pregunta.pregunta,
                porcentaje_aciertos: porcentajeAciertos.toFixed(2),
                texto_pregunta: pregunta.texto_pregunta,
                opciones: Object.values(pregunta.opciones)
            };
        });


        if (!intentos) return {
            status: 404,
            ok: false,
            msg: 'No hay preguntas disponibles'
        }

        return {
            status: 200,
            ok: true,
            msg: null,
            intentos: rendimientoPreguntasArray
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg:'Error en el servidor',
            borradores: null
        };
    }
};

export const obtenerUltimoExamenAplicadoService = async(carrera) => {
    try {
         //Ultimo examen aplicado
         const examen = await Intento_examen.findOne({
            include: [{
                model: Examen,
                attributes: ['nombre'],
                where: { carrera }
            }],
            order: [["fecha_aplicacion", 'DESC']]
        })

        if(!examen) { 
            return {
                status: 404,
                ok: false,
                msg: "No se han aplicado exámenes",
                examen: null
            }
        }

        return {
            status: 200,
            ok: true,
            msg: null,
            examen
        }


    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg:'Error en el servidor',
            examen: null
        };
    }
}

export const obtenerCalificacionesYResumenService = async (id_examen, fechaInicio, fechaFin) => {
    try {
        console.log(fechaInicio, fechaFin);
        // Construcción de la condición opcional de fechas
        let whereCondition = { id_examen };

        if (fechaInicio && fechaFin) {
            whereCondition.fecha_aplicacion = { [Op.between]: [fechaInicio, fechaFin] };
        } else if (fechaInicio) {
            whereCondition.fecha_aplicacion = { [Op.gte]: fechaInicio };
        } else if (fechaFin) {
            whereCondition.fecha_aplicacion = { [Op.lte]: fechaFin };
        }

        let intentos = await Intento_examen.findAll({
            include: [{
                model: Examen,
                where: { id_examen },
                attributes: [],
            }, {
                model: Estudiante
            }],
            attributes: ['id_intento', 'numero_cuenta', 'calificacion'],
            where: whereCondition
        });

        if (!intentos || intentos.length === 0) {
            return {
                status: 404,
                ok: false,
                msg: 'No hay intentos registrados para este examen',
                calificaciones: [],
                resumen: {}
            };
        }

        // Procesamiento de calificaciones
        let totalEstudiantes = intentos.length;
        let sumaCalificaciones = 0;
        let aprobados = 0;
        let reprobados = 0;
        let distribucionCalificaciones = [
            { rango: "0-20", cantidad: 0 },
            { rango: "21-40", cantidad: 0 },
            { rango: "41-60", cantidad: 0 },
            { rango: "61-80", cantidad: 0 },
            { rango: "81-100", cantidad: 0 }
        ];

        let calificaciones = intentos.map(intento => {
            console.log(intento.estudiante.nombre);
            let calificacion = intento.calificacion;
            sumaCalificaciones += calificacion;

            if (calificacion >= 60) {
                aprobados++;
            } else {
                reprobados++;
            }

            // Asignar a la distribución de calificaciones
            if (calificacion <= 20) distribucionCalificaciones[0].cantidad++;
            else if (calificacion <= 40) distribucionCalificaciones[1].cantidad++;
            else if (calificacion <= 60) distribucionCalificaciones[2].cantidad++;
            else if (calificacion <= 80) distribucionCalificaciones[3].cantidad++;
            else distribucionCalificaciones[4].cantidad++;

            return {
                numero_cuenta: intento.numero_cuenta,
                nombre: intento.estudiante.nombre,
                apellido_paterno: intento.estudiante.apellido_paterno,
                apellido_materno: intento.estudiante.apellido_materno ?? '',
                calificacion
            };
        });

        let promedioGeneral = (sumaCalificaciones / totalEstudiantes).toFixed(2);
        let tasaAprobacion = ((aprobados / totalEstudiantes) * 100).toFixed(2);

        let resumen = {
            promedio_general: promedioGeneral,
            total_estudiantes: totalEstudiantes,
            tasa_aprobacion: tasaAprobacion,
            distribucion_calificaciones: distribucionCalificaciones,
            aprobacion: [
                { name: "Aprobados", value: aprobados },
                { name: "Reprobados", value: reprobados }
            ]
        };

        return {
            status: 200,
            ok: true,
            msg: null,
            calificaciones,
            resumen
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            ok: false,
            msg: 'Error en el servidor',
            calificaciones: [],
            resumen: {}
        };
    }
};
