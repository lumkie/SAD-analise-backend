const db = require('../db');


const createTable = () => {
 const sql = `
   CREATE TABLE IF NOT EXISTS DimTipoUso (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     tipo_uso TEXT UNIQUE
   )
 `;
 db.run(sql);
};


const insert = (tipo_uso, callback) => {
 const sql = 'INSERT OR IGNORE INTO DimTipoUso (tipo_uso) VALUES (?)';
 db.run(sql, [tipo_uso], function(err) {
   callback(err, this.lastID);
 });
};


module.exports = { createTable, insert };


