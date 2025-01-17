import Examen from "../models/Examen.js";


export const crearExamenService = async({carrera, nombre, periodo, duracion}) => {
    try {
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
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}