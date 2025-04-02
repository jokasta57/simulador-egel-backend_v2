import jwt from "jsonwebtoken";

export const generarJWT = ( uid, name, apellido_paterno, apellido_materno, role, numero_identificacion, carrera ) => {

    return new Promise((resolve, reject) => {

        const payload = { uid, name, apellido_paterno, apellido_materno, role, numero_identificacion, carrera }

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '8h'
        }, (err, token ) => {
            if(err) {
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}