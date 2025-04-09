const db = require('../db');


module.exports = {
 async getKpis() {
   return new Promise((resolve, reject) => {
     const sqlTotalTempo = `SELECT SUM(tempo_uso) AS soma_total, AVG(tempo_uso) AS tempo_medio_total FROM FatoTempoTela;`;
     const sqlEducacional = `
       SELECT SUM(f.tempo_uso) AS soma_educacional, AVG(f.tempo_uso) AS tempo_educacional
       FROM FatoTempoTela f
       JOIN DimTipoUso t ON f.tipo_uso_id = t.id
       WHERE t.tipo_uso = 'Educacional';
     `;
     const sqlRecreativo = `
       SELECT SUM(f.tempo_uso) AS soma_recreativo, AVG(f.tempo_uso) AS tempo_recreativo
       FROM FatoTempoTela f
       JOIN DimTipoUso t ON f.tipo_uso_id = t.id
       WHERE t.tipo_uso = 'Recreativo';
     `;


     db.get(sqlTotalTempo, [], (err, total) => {
       if (err) return reject(err);
       db.get(sqlEducacional, [], (err2, edu) => {
         if (err2) return reject(err2);
         db.get(sqlRecreativo, [], (err3, rec) => {
           if (err3) return reject(err3);


           const somaTotal = total.soma_total || 0;
           const somaEdu = edu.soma_educacional || 0;
           const somaRec = rec.soma_recreativo || 0;


           const percentualEdu = somaTotal > 0 ? ((somaEdu / somaTotal) * 100).toFixed(2) : 0;
           const percentualRec = somaTotal > 0 ? ((somaRec / somaTotal) * 100).toFixed(2) : 0;


           resolve({
             tempoMedioTotal: total.tempo_medio_total || 0,
             tempoMedioEducacional: edu.tempo_educacional || 0,
             tempoMedioRecreativo: rec.tempo_recreativo || 0,
             percentualEducacional: parseFloat(percentualEdu),
             percentualRecreativo: parseFloat(percentualRec)
           });
         });
       });
     });
   });
 }
};
