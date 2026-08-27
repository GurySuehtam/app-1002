const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let db = { avisos: [], alunos: [], aulas: [], trabalhos: [], agenda: [], materias: [] };

function criarRotas(nome) {
  app.get(`/api/${nome}`, (req, res) => res.json(db[nome] || []));
  app.post(`/api/${nome}`, (req, res) => {
    const item = { id: Date.now().toString(), novo:true,...req.body };
    db[nome].unshift(item);
    res.json(item);
  });
  app.delete(`/api/${nome}/:id`, (req, res) => {
    db[nome] = db[nome].filter(i => i.id!= req.params.id);
    res.json({ok:true});
  });
  app.put(`/api/${nome}/:id/lido`, (req, res) => {
    const item = db[nome].find(i => i.id == req.params.id);
    if(item) item.novo = false;
    res.json({ok:true});
  });
}

['avisos','alunos','aulas','trabalhos','agenda','materias'].forEach(criarRotas);

app.use(express.static(__dirname));
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'turma 1002.html')));

app.listen(PORT, ()=> console.log('ON em '+PORT));
