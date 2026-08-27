const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());
app.use(express.static(__dirname));

// Banco de dados simples em arquivo JSON
const DB_FILE = path.join(__dirname, 'banco.json');
let db = { noticias: [], avisos: [], alunos: [], materias: [], trabalhos: [] };

if (fs.existsSync(DB_FILE)) {
  try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch(e){}
}

function salvar() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Função para criar rotas automáticas
function criarRotas(nome) {
  app.get(`/api/${nome}`, (req, res) => res.json(db[nome] || []));

  app.post(`/api/${nome}`, (req, res) => {
    const item = { id: Date.now().toString(),...req.body, data: new Date().toISOString() };
    db[nome].push(item);
    salvar();
    res.json(item);
  });

  app.delete(`/api/${nome}/:id`, (req, res) => {
    db[nome] = db[nome].filter(i => i.id!= req.params.id);
    salvar();
    res.json({ ok: true });
  });
}

criarRotas('noticias');
criarRotas('avisos');
criarRotas('alunos');
criarRotas('materias');
criarRotas('trabalhos');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'inicio.html'));
});

app.listen(PORT, () => {
  console.log('Rodando na porta ' + PORT);
});
