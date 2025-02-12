import { Examen, Intento_examen } from "../models/asociaciones.js"

export const obtenerResultadosService = async(numero_cuenta) => {
    let resultados; 
    let historialExamenes = {};

    try {

        const intentos = await Intento_examen.findAll({
            where: {
                numero_cuenta
            },
            include: {
                model: Examen
            }
        });

        console.log(intentos);

        if(!intentos) {
            return {
                status: 404,
                ok: false,
                msg: 'No hay intentos aún',
                resultados: null,
                historialExamenes: null
            }
        }

        historialExamenes = intentos.map((intento) => {
            historialExamenes.examen = intento.examen;
        })

        return {
            status: 200,
            ok: true,
            msg: null,
            resultados,
            historialExamenes
        }
        
    } catch (error) {
        return {
            status: 500,
            ok: false,
            msg: null,
            resultados: null,
            historialExamenes: null
        }
    }
}