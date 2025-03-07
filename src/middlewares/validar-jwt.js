import { response } from "express";
import jwt from "jsonwebtoken";

export const validarJWT = (req, res = response, next) => {

    //x-token headers
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid, name, apellido_paterno, apellido_materno, role, numero_identificacion, carrera } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )

        req.uid = uid;
        req.name = name;
        req.apellido_paterno = apellido_paterno;
        req.apellido_materno = apellido_materno;
        req.role = role;
        req.numero_identificacion = numero_identificacion;
        req.carrera = carrera;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    next();

}

export const validarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const role = req.role; // 'req.usuario' se llena al validar el JWT en 'validarJWT'
            if (!rolesPermitidos.includes(role)) {
                return res.status(403).json({
                    msg: 'No tienes permisos para realizar esta acción.',
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ msg: 'Error al verificar el rol.', error });
        }
    };
};
