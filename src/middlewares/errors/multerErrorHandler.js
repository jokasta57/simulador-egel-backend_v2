import multer from "multer";
import { uploadImage } from "../../config/multer-config.js";

const uploadSingleImage = uploadImage.single('imagen');

export const errorHandlingImages = (req, res, next) => {
    uploadSingleImage(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            switch(err.code) {
                case 'LIMIT_FILE_SIZE': 
                    return res.status(400).json({ msg: 'El archivo excede el tamaño máximo permitido' })
                case 'LIMIT_UNEXPECTED_FILE':
                    return res.status(400).json({ msg: 'Número inesperado de archvios'})
                case 'LIMIT_FILE_COUNT':
                    return res.status(400).json({ msg: 'Has subido demasiado archivos'})
                default: 
                    return res.status(400).json({ msg: err.message });
            }
        }
        if (err) {
            return res.status(400).send({ msg: err.message })
        }
        next();
    });
}
