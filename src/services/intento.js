import {Intento_examen, Examen} from "../models/asociaciones.js";

export const crearIntentoService = async(numero_cuenta, id_examen) => {
    try {
        const fechaHoy = new Date();
        
        const examenExistente = await Examen.findOne({where: {id_examen}});

        if(!examenExistente) {
            return {
                status: 404,
                ok: false,
                msg: "No existe un examen con este ID",
                intento: null
            }
        }

        const intento = await Intento_examen.create({
            numero_cuenta,
            id_examen,
            fecha_aplicacion: fechaHoy
        })

        return {
            status: 201,
            ok: true, 
            msg: 'Intento creado exitosamente',
            intento
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const obtenerIntentoPorIdService = async(id_intento) => {
    try {
        
        const intentoExistente = await Intento_examen.findOne({where: {id_intento}});

        if(!intentoExistente) {
            return {
                status: 404,
                ok: false,
                msg: "No existe un intento con este ID",
                intento: null
            }
        }

        const intento = await Intento_examen.findOne({
            where: {
                id_intento
            },
            include: {
                model: Examen
            }
        });

        return {
            status: 201,
            ok: true, 
            msg: null,
            intento
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}

export const actualizarIntentoService = async(id_intento, calificacion) => {
    try {
        
        const intentoExistente = await Intento_examen.findOne({where: {id_intento}});

        if(!intentoExistente) {
            return {
                status: 404,
                ok: false,
                msg: "No existe un intento con este ID",
                intento: null
            }
        }

        const intento = await Intento_examen.update({calificacion}, {where: {id_intento}});

        return {
            status: 201,
            ok: true, 
            msg: null,
            intento
        }

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        })
    }
}