import Admin from "../models/Admin.js";

export const crearAdministradorService = async(nombre, numero_identificacion, nip, apellido_paterno, apellido_materno, carrera) => {
    try {
        //Verificar que no haya duplicados
        const existeUsuario = await Admin.findOne({ where: { numero_identificacion } });
        if (existeUsuario) {
            return {
                ok: false,
                status: 409,
                msg: "Este usuario ya existe"
            }
        }
        //Crear nuevo administrador
        const admin = await Admin.create({
            nombre, 
            numero_identificacion, 
            nip,
            apellido_paterno, 
            apellido_materno,
            carrera
        })


        return {
            ok: true, 
            status: 201,
            msg: "Administrador creado exitosamente",
            admin
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const obtenerAdministradoresService = async() => {
    try {        
        const administradores = await Admin.findAll({
            attributes: ['id_admin', 'nombre', 'apellido_paterno', 'apellido_materno', 'numero_identificacion', 'carrera'],
            where: {
                superAdmin: 0 || false
            }
        });

        if(administradores.length === 0) { 
            return  {
                ok: false,
                status: 404,
                msg: 'No hay administradores disponibles.',
                administradores: null
            }
        }

        return {
            ok: true, 
            status: 200,
            msg: "",
            administradores
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const actualizarAdministradorService = async(id_admin, newData) => {
    try {        
        const administrador = await Admin.findOne({where: {id_admin}});

        if(!administrador) { 
            return  {
                ok: false,
                status: 404,
                msg: 'Este administrador no existe',
                administradores: null
            }
        }

        await Admin.update(newData, {where: {id_admin}})

        return {
            ok: true, 
            status: 200,
            msg: "Administrador actualizado exitosamente"
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const eliminarAdministradorService = async(id_admin) => {
    try {
        
        const administrador = await Admin.findOne({where: {id_admin}});

        if(!administrador) { 
            return  {
                ok: false,
                status: 404,
                msg: 'Este administrador no existe',
                administradores: null
            }
        }

        await Admin.destroy({where: {id_admin}})

        return {
            ok: true, 
            status: 200,
            msg: "Administrador eliminado exitosamente",
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}