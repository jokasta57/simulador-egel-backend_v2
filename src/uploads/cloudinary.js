import { cloudinary } from "../config/cloudinary-config.js";
import { optimizarRecurso } from "../helpers/optimizacion-recurso.js";
import streamifier from 'streamifier'

export const subirCloudinary = async (recurso, folder) => {
    try {
        //Si hay archivos
        if (recurso) {
            //Optimizacion de imagenes
            const compressedBuffer = await optimizarRecurso(recurso);

            // Retorna una Promise para manejar la subida de forma asíncrona
            return new Promise((resolve, reject) => {
                const cld_upload_stream = cloudinary.uploader.upload_stream(
                    {
                        folder: folder, // Folder donde se guardará en Cloudinary
                    },
                    (error, result) => {
                        if (error) {
                            console.log(error);
                            resolve({
                                ok: false,
                                status: 400,
                                msg: 'Error al cargar recurso',
                                url_foto: null
                            });
                        } else {
                            resolve({
                                ok: true,
                                status: 200,
                                msg: null,
                                url_recurso: result.secure_url
                            });
                        }
                    }
                );

                // Convierte el buffer en un flujo de datos para subirlo a Cloudinary
                streamifier.createReadStream(compressedBuffer).pipe(cld_upload_stream);
            });
        } else {
            return {
                ok: false,
                status: 400,
                msg: 'No hay archivos seleccionados',
                url_foto: null
            }
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor',
            url_foto: null
        }
    }
}

export const eliminarCloudinary = async (url) => {
    try {
        const publicId = obtenerPublicId(url);
        await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        return {
            ok: false,
            status: 500,
            msg: 'Error en el servidor'
        }
    }
}

const obtenerPublicId = (url) => {
    const regex = /upload\/(?:v\d+\/)?(.+)\.\w+$/; // Extrae después de 'upload/' y antes de la extensión
    const match = url.match(regex);
    return match ? match[1] : null;
}
