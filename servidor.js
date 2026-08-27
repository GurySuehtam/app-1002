servidor.js: const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DB_PATH = path.join(__dirname, 'db.json');
if(!fs.existsSync(DB_PATH)){
  fs.writeFileSync(DB_PATH, JSON.stringify({alunos:[],avisos:[],materias:[],trabalhos:[],agenda:[],aulas:[]},null,2));
}
function lerDB(){ return JSON.parse(fs.readFileSync(DB_PATH,'utf8')); }
function salvarDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2)); }

['avisos','materias','trabalhos','agenda','alunos','aulas'].forEach(tipo=>{
  app.get('/api/'+tipo, (req,res)=>{ try{ res.json(lerDB()[tipo]||[]); }catch{ res.json([]);} });
  app.post('/api/'+tipo, (req,res)=>{
    let db=lerDB(); if(!db[tipo]) db[tipo]=[];
    let item={id:Date.now().toString(),...req.body, data_criacao:new Date().toISOString()};
    db[tipo].push(item); salvarDB(db); res.json(item);
  });
  app.delete('/api/'+tipo+'/:id', (req,res)=>{
    let db=lerDB(); db[tipo]=(db[tipo]||[]).filter(i=>String(i.id)!=String(req.params.id)); salvarDB(db); res.json({ok:true});
  });
});

app.post('/api/eter', (req,res)=>{
  res.json({resposta: `ÉTER AI: "${req.body.pergunta}" - Tô em beta, mas foca que vai cair na prova!`});
});

app.get('*', (req,res)=>{
  if(req.path.startsWith('/api/')) return res.status(404).json({erro:'API não encontrada'});
  let file = req.path==='/'? 'index.html' : req.path.substring(1);
  let full = path.join(__dirname, file);
  if(fs.existsSync(full)) return res.sendFile(full);
  return res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT, ()=>console.log('1002 ONLINE '+PORT));
