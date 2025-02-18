import jwt from "jsonwebtoken";

export const generarJWT = ( uid, name, apellido_paterno, apellido_materno, role ) => {
    console.log(role, 'roleee');

    return new Promise((resolve, reject) => {

        const payload = { uid, name, apellido_paterno, apellido_materno, role }

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '8h'
        }, (err, token ) => {
            if(err) {
                console.log(err)
                reject('No se pudo generar el token')
            }

            resolve( token );
        })

    })

}