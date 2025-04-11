const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


const db = require('./db');
const kpi = require('./queries/kpi');
const olap = require('./queries/olap');
const mining = require('./queries/mining');

app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json());


app.get('/api/kpis', async (req, res) => {
 const result = await kpi.getKpis();
 res.json(result);
});


app.get('/api/por-idade', async (req, res) => {
 const result = await olap.getTempoPorIdade();
 res.json(result);
});


app.get('/api/pivot', async (req, res) => {


 const { linha, coluna } = req.query;
 const result = await olap.pivotTable(linha, coluna);
 res.json(result);
});


app.get('/api/horas-por-dia', async (req, res) => {
 const result = await olap.getHorasPorTipoDia();
 res.json(result);
});


app.get('/api/media-dia', async (req, res) => {
 const result = await olap.getMediaPorTipoDia();
 res.json(result);
});


app.get('/api/clusters', async (req, res) => {
 const result = await mining.getClusters();
 res.json(result);
});


app.get('/api/classificacao', async (req, res) => {
 const result = await mining.getClassificacao();
 res.json(result);
});


app.get('/api/associacoes', async (req, res) => {
 const result = await mining.getAssociacoes();
 res.json(result);
});


app.listen(port, () => {
 console.log(`Servidor backend rodando em http://localhost:${port}`);
});
