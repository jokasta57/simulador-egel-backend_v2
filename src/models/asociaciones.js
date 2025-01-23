import Examen from "./Examen.js";
import Opcion from "./Opcion.js";
import Pregunta from "./Pregunta.js";

Examen.hasMany(Pregunta, {foreignKey: 'id_examen'});
Pregunta.belongsTo(Examen, {foreignKey: 'id_examen'});

Pregunta.hasMany(Opcion, {foreignKey: 'id_pregunta'})
Opcion.belongsTo(Pregunta, {foreignKey: 'id_pregunta'});

export {
    Pregunta,
    Examen,
    Opcion
}