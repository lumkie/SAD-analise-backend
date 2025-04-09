const db = require('../db');


module.exports = {
 createTable() {
   db.run(`
     CREATE TABLE IF NOT EXISTS FatoTempoTela (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       genero_id INTEGER,
       idade_id INTEGER,
       tipo_dia_id INTEGER,
       tipo_uso_id INTEGER,
       tempo_uso REAL,
       amostra INTEGER,
       FOREIGN KEY (genero_id) REFERENCES DimGenero(id),
       FOREIGN KEY (idade_id) REFERENCES DimIdade(id),
       FOREIGN KEY (tipo_dia_id) REFERENCES DimTipoDia(id),
       FOREIGN KEY (tipo_uso_id) REFERENCES DimTipoUso(id)
     )
   `);
 },


 insert(genero_id, idade_id, tipo_dia_id, tipo_uso_id, tempo_uso, amostra, callback) {
   db.run(`
     INSERT INTO FatoTempoTela (
       genero_id, idade_id, tipo_dia_id, tipo_uso_id, tempo_uso, amostra
     ) VALUES (?, ?, ?, ?, ?, ?)
   `, [genero_id, idade_id, tipo_dia_id, tipo_uso_id, tempo_uso, amostra], callback);
 }
};
