import Admin from "../models/Admin.js";

export const crearAdministradorService = async(nombre, numero_identificacion, nip, apellido_paterno, apellido_materno) => {
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
        })


        return {
            ok: true, 
            status: 201,
            msg: "Administrador creado exitosamente",
            admin
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

export const obtenerAdministradoresService = async() => {
    try {
        
        const administradores = await Admin.findAll({
            attributes: ['id_admin', 'nombre', 'apellido_paterno', 'apellido_materno', 'numero_identificacion']
        },{
            where: {
                superAdmin: false
            }
        });

        if(!administradores) { 
            return  {
                ok: false,
                status: 404,
                msg: 'No se encontraron administradores',
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
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const actualizarAdministradorService = async() => {
    try {
        
        const administradores = await Admin.findAll({where: {superAdmin: false}});

        if(!administradores) { 
            return  {
                ok: false,
                status: 404,
                msg: 'No se encontraron administradores',
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
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}

export const eliminarAdministradorService = async() => {
    try {
        
        const administradores = await Admin.findAll({where: {superAdmin: false}});

        if(!administradores) { 
            return  {
                ok: false,
                status: 404,
                msg: 'No se encontraron administradores',
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
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        };
    }
}