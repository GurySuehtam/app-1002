const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname, { setHeaders: (res, p) => { if(p.endsWith('.html')) res.setHeader('Cache-Control','no-store') } }));

const DB = path.join(__dirname,'banco.json');
function ler(){
  if(!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({alunos:[],avisos:[],materias:[],aulas:[],trabalhos:[],agenda:[]},null,2));
  return JSON.parse(fs.readFileSync(DB,'utf8'));
}
function salvar(db){ fs.writeFileSync(DB, JSON.stringify(db,null,2)); }
function genId(){ return Date.now().toString(36)+Math.random().toString(36).substring(2,5) }

function criarRota(nome){
  app.get('/api/'+nome, (req,res)=> res.json(ler()[nome]||[]) );
  app.post('/api/'+nome, (req,res)=>{
    const db=ler(); const item={id:genId(), criado_em:new Date().toISOString(),...req.body};
    db[nome].push(item); salvar(db); res.json(item);
  });
  app.delete('/api/'+nome+'/:id', (req,res)=>{
    const db=ler(); db[nome]=db[nome].filter(x=>String(x.id)!==String(req.params.id)); salvar(db); res.json({ok:true});
  });
}

criarRota('alunos');
criarRota('avisos');
criarRota('materias');
criarRota('trabalhos');
criarRota('agenda');

app.get('/api/aulas', (req,res)=> res.json(ler().aulas||[]));
app.post('/api/aulas', (req,res)=>{
  const db=ler();
  const aula={id:genId(), criado_em:new Date().toISOString(), materia_id:String(req.body.materia_id), titulo:req.body.titulo, data_aula:req.body.data_aula, conteudo:req.body.conteudo||'', quadro:req.body.quadro||'', observacoes:req.body.observacoes||'', novo:true};
  db.aulas.push(aula); salvar(db); res.json(aula);
});
app.delete('/api/aulas/:id', (req,res)=>{const db=ler();db.aulas=db.aulas.filter(x=>String(x.id)!==String(req.params.id));salvar(db);res.json({ok:true})});

app.get('/materias.html',(req,res)=> res.sendFile(path.join(__dirname,'materias.html')));

// LINHA CORRIGIDA PRO RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', ()=> console.log('✅ SERVIDOR OK na porta ' + PORT));