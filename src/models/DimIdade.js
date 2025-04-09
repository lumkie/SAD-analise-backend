//tabela dimensao idade
const db = require('../db');


const createTable = () => {
 const sql = `
   CREATE TABLE IF NOT EXISTS DimIdade (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     faixa_etaria TEXT UNIQUE
   )
 `;
 db.run(sql);
};


const insert = (faixa_etaria, callback) => {
 const sql = 'INSERT OR IGNORE INTO DimIdade (faixa_etaria) VALUES (?)';
 db.run(sql, [faixa_etaria], function(err) {
   callback(err, this.lastID);
 });
};


module.exports = { createTable, insert };
