const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const SUPABASE_URL = 'https://hoaxcirdtpsgtvdnkctm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvYXhjaXJkdHBzZ3R2ZG5rY3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTMyOTYsImV4cCI6MjEwMzQyOTI5Nn0.gVA5lpKMYoEMqEGzCVnY1-vx3V6eF-2OJ5kBDBw27Vk';
async function sb(tabela, metodo='GET', body=null, query=''){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${tabela}${query}`,{method:metodo,headers:{'apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json','Prefer':'return=representation'},body:body?JSON.stringify(body):null});
  const d=await r.json(); if(!r.ok) throw d; return d;
}
['alunos','avisos','materias','aulas','trabalhos','agenda'].forEach(tabela=>{
  app.get(`/api/${tabela}`,async(req,res)=>{try{res.json(await sb(tabela,'GET',null,'?select=*&order=criado_em.desc'))}catch(e){res.status(500).json(e)}});
  app.post(`/api/${tabela}`,async(req,res)=>{try{const item={...req.body,id:req.body.id||Date.now().toString(),criado_em:new Date().toISOString()};res.json((await sb(tabela,'POST',item))[0])}catch(e){res.status(500).json(e)}});
  app.delete(`/api/${tabela}/:id`,async(req,res)=>{try{await sb(tabela,'DELETE',null,`?id=eq.${req.params.id}`);res.json({ok:true})}catch(e){res.status(500).json(e)}});
});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log('Supabase ON'));
