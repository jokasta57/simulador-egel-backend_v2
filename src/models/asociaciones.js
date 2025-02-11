import Estudiante from "./Estudiante.js";
import Examen from "./Examen.js";
import Intento_examen from "./Intento_examen.js";
import Opcion from "./Opcion.js";
import Pregunta from "./Pregunta.js";
import Respuesta from "./Respuesta.js";

Examen.hasMany(Pregunta, {foreignKey: 'id_examen'});
Pregunta.belongsTo(Examen, {foreignKey: 'id_examen'});

Pregunta.hasMany(Opcion, {foreignKey: 'id_pregunta', as: 'opcion'})
Opcion.belongsTo(Pregunta, {foreignKey: 'id_pregunta', as: 'pregunta'});

Estudiante.hasMany(Intento_examen, {foreignKey: 'numero_cuenta'})
Intento_examen.belongsTo(Estudiante, {foreignKey: 'numero_cuenta'});

Examen.hasMany(Intento_examen, {foreignKey: 'id_examen'})
Intento_examen.belongsTo(Examen, {foreignKey: 'id_examen'});

Opcion.hasMany(Respuesta, {foreignKey: 'id_opcion'})
Respuesta.belongsTo(Opcion, {foreignKey: 'id_opcion'});

Intento_examen.hasMany(Respuesta, {foreignKey: 'id_intento'})
Respuesta.belongsTo(Intento_examen, {foreignKey: 'id_intento'});

export {
    Pregunta,
    Examen,
    Opcion,
    Intento_examen,
    Respuesta,
    Estudiante
}