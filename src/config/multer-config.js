import multer from "multer";

const storage = multer.memoryStorage();

// *Filtro de imagen
const imageFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG, GIF y WebP.'), false);
    }
};

//Configuracion de multer
export const uploadImage = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { 
        fileSize: 4 * 1024 * 1024 
    } //Limite de 5 MB
});


