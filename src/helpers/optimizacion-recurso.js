import sharp from "sharp";

export const optimizarRecurso = async (recurso) => {
    try {
        // Convierte la imagen a formato WebP con calidad 80%
        const buffer = recurso.buffer;
        const compressedBuffer = await sharp(buffer)
            .webp({ quality: 80 }) // Reduce la calidad al 80%
            .toBuffer(); // Devuelve el buffer comprimido

        return compressedBuffer; // Retorna la imagen optimizada
    } catch (error) {
        throw error("No se pudo optimizar la imagen");
    }
}