const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');


const db = require('./db');


const DimGenero = require('./models/DimGenero');
const DimIdade = require('./models/DimIdade');
const DimTipoDia = require('./models/DimTipoDia');
const DimTipoUso = require('./models/DimTipoUso');
const FatoTempoTela = require('./models/FatoTempoTela');


function limparChaves(obj) {
 const limpo = {};
 for (let chave in obj) {
   const chaveLimpa = chave.trim();
   limpo[chaveLimpa] = obj[chave];
 }
 return limpo;
}


function criarTabelas() {
 return new Promise((resolve) => {
   DimGenero.createTable();
   DimIdade.createTable();
   DimTipoDia.createTable();
   DimTipoUso.createTable();
   FatoTempoTela.createTable();
   setTimeout(resolve, 1000);
 });
}


async function carregarCSV() {
 await criarTabelas();
 const csvPath = path.resolve(__dirname, '../dataset2.csv');


 fs.createReadStream(csvPath)
   .pipe(csv({ separator: ',' }))
   .on('data', (rawRow) => {
     const row = limparChaves(rawRow); // Corrige espaços nas chaves


     const genero = (row['Gênero'] || '').trim();
     const tipoDia = (row['Tipo de Dia'] || '').trim();
     const tipoUso = (row['Tipo de Tempo de Tela'] || '').trim();
     const idade = `Idade ${(row['Idade'] || '').trim()}`;
     const tempoUso = parseFloat((row['Média de Tempo de Tela (horas)'] || '').trim());
     const amostra = parseInt((row['Tamanho da Amostra'] || '').trim());


     if (isNaN(tempoUso) || isNaN(amostra)) {
       console.warn('⛔ Dados inválidos, ignorando linha:', row);
       return;
     }


     DimGenero.insert(genero, (err, genero_id) => {
       if (err) return console.error(err);
       DimIdade.insert(idade, (err, idade_id) => {
         if (err) return console.error(err);
         DimTipoDia.insert(tipoDia, (err, tipo_dia_id) => {
           if (err) return console.error(err);
           DimTipoUso.insert(tipoUso, (err, tipo_uso_id) => {
             if (err) return console.error(err);
             FatoTempoTela.insert(
               genero_id,
               idade_id,
               tipo_dia_id,
               tipo_uso_id,
               tempoUso,
               amostra,
               (err) => {
                 if (err) console.error(err);
               }
             );
           });
         });
       });
     });
   })
   .on('end', () => {
     console.log('✅ CSV processado e dados inseridos com sucesso.');
   });
}


carregarCSV();