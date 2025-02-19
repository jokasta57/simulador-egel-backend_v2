import { Op, Sequelize } from "sequelize"
import { Estudiante, Examen, Intento_examen } from "../models/asociaciones.js"

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
                : "0.00"
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
