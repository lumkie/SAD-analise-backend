//tabela dimensao tipo de dia
//tabela dimensao tipo de dia
const db = require('../db');


const createTable = () => {
 const sql = `
   CREATE TABLE IF NOT EXISTS DimTipoDia (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     tipo_dia TEXT UNIQUE
   )
 `;
 db.run(sql);
};


const insert = (tipo_dia, callback) => {
 const sql = 'INSERT OR IGNORE INTO DimTipoDia (tipo_dia) VALUES (?)';
 db.run(sql, [tipo_dia], function(err) {
   callback(err, this.lastID);
 });
};


module.exports = { createTable, insert };




