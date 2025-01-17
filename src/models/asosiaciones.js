import Examen from "./Examen";
import Opcion from "./Opciones";
import Pregunta from "./Pregunta";

Examen.hasMany(Pregunta, {foreignKey: 'id_examen'});
Pregunta.belongsTo(Examen, {foreignKey: 'id_examen'});

Pregunta.hasMany(Opcion, {foreignKey: 'id_pregunta'})
Opcion.belongsTo(Pregunta, {foreignKey: 'id_pregunta'});