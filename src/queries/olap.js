const db = require('../db');


module.exports = {
 async getTempoPorIdade() {
   return new Promise((resolve, reject) => {
     const sql = `
       SELECT d.faixa_etaria, AVG(f.tempo_uso) as tempo_medio
       FROM FatoTempoTela f
       JOIN DimIdade d ON f.idade_id = d.id
       GROUP BY d.faixa_etaria;
     `;
     db.all(sql, [], (err, rows) => {
       if (err) return reject(err);
       resolve(rows);
     });
   });
 },


 async pivotTable(linha, coluna) {
   return new Promise((resolve, reject) => {
     const joinMap = {
       idade: 'JOIN DimIdade i ON f.idade_id = i.id',
       genero: 'JOIN DimGenero g ON f.genero_id = g.id',
       tipo_dia: 'JOIN DimTipoDia dtd ON f.tipo_dia_id = dtd.id',
       tipo_uso: 'JOIN DimTipoUso dtu ON f.tipo_uso_id = dtu.id'
     };


     const campoMap = {
       idade: 'i.faixa_etaria',
       genero: 'g.genero',
       tipo_dia: 'dtd.tipo_dia',
       tipo_uso: 'dtu.tipo_uso'
     };


     if (!joinMap[linha] || !joinMap[coluna]) {
       return reject({ error: 'Parâmetros inválidos' });
     }


     const sql = `
       SELECT ${campoMap[linha]} AS linha, ${campoMap[coluna]} AS coluna, AVG(f.tempo_uso) AS tempo_medio
       FROM FatoTempoTela f
       ${joinMap[linha]}
       ${joinMap[coluna]}
       GROUP BY linha, coluna
       ORDER BY linha, coluna;
     `;
     db.all(sql, [], (err, rows) => {
       if (err) return reject(err);
       resolve(rows);
     });
   });
 },


 async getHorasPorTipoDia() {
   return new Promise((resolve, reject) => {
     const sql = `
       SELECT dtd.tipo_dia, SUM(f.tempo_uso) AS horas_totais
       FROM FatoTempoTela f
       JOIN DimTipoDia dtd ON f.tipo_dia_id = dtd.id
       GROUP BY dtd.tipo_dia;
     `;
     db.all(sql, [], (err, rows) => {
       if (err) return reject(err);
       resolve(rows);
     });
   });
 },


 async getMediaPorTipoDia() {
   return new Promise((resolve, reject) => {
     const sql = `
       SELECT
         dtd.tipo_dia,
         ROUND(SUM(f.tempo_uso * f.amostra) / SUM(f.amostra), 2) AS tempo_medio_ponderado,
         SUM(f.amostra) AS tamanho_amostra
       FROM FatoTempoTela f
       JOIN DimTipoDia dtd ON f.tipo_dia_id = dtd.id
       GROUP BY dtd.tipo_dia;
     `;
     db.all(sql, [], (err, rows) => {
       if (err) return reject(err);
       resolve(rows);
     });
   });
 }
};
