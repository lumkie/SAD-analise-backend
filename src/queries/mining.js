const db = require('../db');
const { spawn } = require('child_process');


// Coleta os dados do banco para enviar pro Python
function fetchData() {
 return new Promise((resolve, reject) => {
   const sql = `
     SELECT
       i.faixa_etaria AS idade,
       CASE g.genero WHEN 'Masculino' THEN 0 ELSE 1 END AS genero,
       CASE dtd.tipo_dia WHEN 'Dia de Semana' THEN 0 ELSE 1 END AS tipo_dia,
       CASE dtu.tipo_uso
         WHEN 'Educacional' THEN 0
         WHEN 'Recreativo' THEN 1
         ELSE 2 END AS tipo_uso,
       f.tempo_uso,
       f.tempo_uso > 1.5 as action
     FROM FatoTempoTela f
     JOIN DimIdade i ON f.idade_id = i.id
     JOIN DimGenero g ON f.genero_id = g.id
     JOIN DimTipoDia dtd ON f.tipo_dia_id = dtd.id
     JOIN DimTipoUso dtu ON f.tipo_uso_id = dtu.id
   `;
   db.all(sql, [], (err, rows) => {
     if (err) return reject(err);
     // Extrai apenas o número da faixa etária
     rows.forEach(r => {
       r.idade = parseInt(r.idade.replace(/\D/g, ''));
     });
     resolve(rows);
   });
 });
}


// Função que executa o Python com os dados
function runPythonMining(data) {
 return new Promise((resolve, reject) => {
   const python = spawn('python3', ['src/mining.py']);


   let output = '';
   let errorOutput = '';


   python.stdout.on('data', chunk => output += chunk.toString());
   python.stderr.on('data', chunk => errorOutput += chunk.toString());


   python.on('close', code => {
     if (code !== 0) {
       console.error('Erro Python:', errorOutput);
       return reject(new Error('Erro ao executar script Python.'));
     }
     try {
       const parsed = JSON.parse(output);
       resolve(parsed);
     } catch (err) {
       console.error('Erro ao interpretar resposta do Python:', err);
       reject(err);
     }
   });


   // Envia os dados como JSON pro Python
   python.stdin.write(JSON.stringify(data));
   python.stdin.end();
 });
}


// Exporta as funções da API
module.exports = {
 async getClusters() {
   const data = await fetchData();
   const result = await runPythonMining(data);
   return { clusters: result.clusters };
 },


 async getClassificacao() {
   const data = await fetchData();
   const result = await runPythonMining(data);
   return { arvore: result.classificacao };
 },


 async getAssociacoes() {
   const data = await fetchData();
   const result = await runPythonMining(data);
   return result.associacoes;
 }
};
