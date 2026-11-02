import pkg from "sequelize";
const { Op } = pkg;
import Examen from "../models/Examen.js";


export const crearExamenService = async({carrera, nombre, periodo, duracion}) => {
    try {
        await new Promise(res => setTimeout(res, 2000));
        const fecha = new Date();
        //Verificar que no haya duplicados
        const nombreDisponible = await Examen.findOne({ where: { nombre } });
        if (nombreDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "Ya existe un examen con este título."
            }
        }
        //Crear nuevo estudiante
        const examen = await Examen.create({
            carrera, 
            nombre, 
            periodo, 
            duracion, 
            fecha_modificacion: fecha,
            estado: 'borrador',
        })

        return {
            ok: true, 
            status: 201,
            msg: "Examen guardado exitosamente",
            examen
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const editarExamenService = async(updateInfo, id_examen) => {
    try {
        const examen = await Examen.findByPk(id_examen)

        if(!examen || examen.length === 0) {
            return {
                ok: false,
                status: 404,
                msg: 'El examen no existe o ha sido eliminado'
            }
        }

        const fecha = new Date();
        updateInfo.fecha_modificacion = fecha;
        //Verificar que no haya duplicados
        const nombreDisponible = await Examen.findOne({ 
            where: { 
                nombre: examen.nombre,
                id_examen: { [Op.ne]: id_examen } // Asegura que no sea la misma pregunta
            } 
        });

        if (nombreDisponible) {
            return {
                ok: false,
                status: 409,
                msg: "Ya existe un examen con este título."
            }
        }
        //Crear nuevo estudiante
        await Examen.update(updateInfo, {where: {id_examen}})

        return {
            ok: true, 
            status: 201,
            msg: "Examen actualizado exitosamente",
            examen
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const editarEstadoExamenService = async(estado, id_examen) => {
    try {
        const examen = await Examen.findByPk(id_examen)

        if(!examen || examen === 0) {
            return {
                ok: false,
                status: 404,
                msg: 'Este examen ya no está disponible',
                examen: null
            }
        }

        //Crear nuevo estudiante
        await Examen.update({estado}, {where: {id_examen}})

        return {
            ok: true, 
            status: 201,
            msg: "Examen actualizado exitosamente",
            examen
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor',
            examen: null
        };
    }
}

export const obtenerExamenService = async(carrera) => {
    try {
        const examenes = await Examen.findAll({where: {carrera}});


        if(!examenes || examenes.length === 0) {
            return {
                ok: false,
                status: 404,
                msg: 'No hay exámenes disponibles',
                examenes: null
            }
        }


        return {
            ok: true, 
            status: 201,
            msg: null,
            examenes
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerExamenPorCarreraService = async(carrera) => {
    try {        
        const examenes = await Examen.findAll({where: {carrera, estado: "activo"}});

        if(!examenes || examenes.length === 0) {
            return {
                ok: false,
                status: 404,
                msg: 'No hay exámenes disponibles',
                examenes: null
            }
        }


        return {
            ok: true, 
            status: 201,
            msg: null,
            examenes
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerExamenPorIdService = async(id) => {
    try {
        
        const examen = await Examen.findByPk(id);

        if(!examen) {
            return {
                ok: false,
                status: 404,
                msg: 'Este examen no existe',
                examen: null
            }
        }


        return {
            ok: true, 
            status: 201,
            msg: null,
            examen
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}