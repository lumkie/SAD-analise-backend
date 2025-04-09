//cria as tabelas no banco
//Configuração e conexão SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, 'data', 'tempo_tela.db');
const db = new sqlite3.Database(dbPath, (err) => {
 if (err) {
   console.error('Erro ao conectar ao banco de dados:', err.message);
 } else {
   console.log('Conectado ao banco de dados SQLite.');
 }
});


module.exports = db;
