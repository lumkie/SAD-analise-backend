//tabela dimensao genero
const db = require('../db');


const createTable = () => {
 const sql = `
   CREATE TABLE IF NOT EXISTS DimGenero (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     genero TEXT UNIQUE
   )
 `;
 db.run(sql);
};


const insert = (genero, callback) => {
 const sql = 'INSERT OR IGNORE INTO DimGenero (genero) VALUES (?)';
 db.run(sql, [genero], function(err) {
   callback(err, this.lastID);
 });
};


module.exports = { createTable, insert };