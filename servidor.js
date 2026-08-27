const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// CONECTA SUPABASE - NÃO APAGA NUNCA MAIS
const SUPABASE_URL = 'https://apxktbsqjopwlqdkxiyc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweGt0YnNxam9wd2xxZGt4aXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjU3NDYsImV4cCI6MjA3MjAwMTc0Nn0.a-2-DvJDie7v-b0fAEetbP3XlWM5Xy2a9Oul1FGhHkeU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ROTA DO PAINEL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/inicio.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'inicio.html'));
});

// PEGAR DADOS
app.get('/dados', async (req, res) => {
  try {
    const { data, error } = await supabase.from('dados_app').select('conteudo').eq('id', 1).single();
    if (error) throw error;
    res.json(data ? data.conteudo : { alunos: [], materias: [], avisos: [], aulas: [] });
  } catch (e) {
    console.log('Erro ao buscar:', e.message);
    res.json({ alunos: [], materias: [], avisos: [], aulas: [] });
  }
});

// SALVAR DADOS
app.post('/salvar', async (req, res) => {
  try {
    const { error } = await supabase.from('dados_app').upsert({ id: 1, conteudo: req.body });
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.log('Erro ao salvar:', e.message);
    res.status(500).json({ erro: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Supabase ON na porta ' + PORT));
