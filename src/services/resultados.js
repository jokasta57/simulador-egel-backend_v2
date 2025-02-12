import { col, fn, literal } from "sequelize";
import { Examen, Intento_examen } from "../models/asociaciones.js"

export const obtenerResultadosService = async (numero_cuenta) => {
    let resultados = {};
    let historialExamenes = {};

    try {
        //Obtener el historial de examenes del estudiante
        historialExamenes = await Intento_examen.findAll({
            attributes: [
                [col("Examen.nombre"), "nombre"],
                [col("Examen.area"), "area"],
                [col("fecha_aplicacion"), "fecha_aplicacion"],
                [
                    literal(`(
                        SELECT COUNT(*)
                        FROM Intento_examen AS i
                        WHERE i.numero_cuenta = Intento_examen.numero_cuenta
                        AND i.id_examen = Intento_examen.id_examen
                        AND i.fecha_aplicacion <= Intento_examen.fecha_aplicacion
                    )`),
                    "intento"
                ],
                [fn("AVG", col("Intento_examen.calificacion")), "calificacion"], // Promedio de calificaciones si hay múltiples intentos
                [
                    literal(`CASE 
                        WHEN AVG(Intento_examen.calificacion) >= 70 THEN 'Aprobado' 
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
            group: ["Examen.nombre", "Examen.area", "Intento_examen.fecha_aplicacion", "Intento_examen.numero_cuenta", "Intento_examen.id_examen"],
            order: [["fecha_aplicacion", "DESC"]]
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