const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

let DB_PATH = path.join(__dirname, 'db.json');
function lerDB(){ try{ return JSON.parse(fs.readFileSync(DB_PATH,'utf8')) }catch(e){ return {alunos:[],avisos:[],materias:[],trabalhos:[],agenda:[]} } }
function salvarDB(db){ fs.writeFileSync(DB_PATH, JSON.stringify(db,null,2)); }
let db = lerDB();

function criarRotas(tipo){
  app.get('/api/'+tipo, (req,res)=> res.json(db[tipo]||[]) );
  app.post('/api/'+tipo, (req,res)=>{
    let item = {id: Date.now().toString(),...req.body, data_criacao: new Date().toISOString()};
    if(!db[tipo]) db[tipo]=[];
    db[tipo].push(item);
    salvarDB(db);
    res.json(item);
  });
  app.delete('/api/'+tipo+'/:id', (req,res)=>{
    db[tipo] = (db[tipo]||[]).filter(i=> i.id!= req.params.id);
    salvarDB(db);
    res.json({ok:true});
  });
}

criarRotas('avisos');
criarRotas('materias');
criarRotas('trabalhos');
criarRotas('agenda');
criarRotas('alunos');

app.post('/api/eter', (req,res)=>{
  res.json({resposta: `ÉTER AI: Você perguntou "${req.body.pergunta}". Ainda estou em beta, mas estude focado nisso que cai na prova!`})
});

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

app.listen(PORT, ()=> console.log('1002 ONLINE NA PORTA '+PORT));
