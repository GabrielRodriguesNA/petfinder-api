const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Banco de dados em memória
let database = {
  usuarios: [
    { id: 1, nome: 'ONG Amigos dos Pets', email: 'ong@email.com', tipo: 'ong' },
    { id: 2, nome: 'João Silva', email: 'joao@email.com', tipo: 'adotante' }
  ],
  animais: [
    { 
      id: 1, 
      nome: 'Rex', 
      especie: 'cachorro', 
      raca: 'Vira-lata', 
      idade: 2, 
      descricao: 'Muito brincalhão e carinhoso', 
      status: 'disponivel', 
      ong_id: 1,
      ong_nome: 'ONG Amigos dos Pets'
    },
    { 
      id: 2, 
      nome: 'Mimi', 
      especie: 'gato', 
      raca: 'Siamês', 
      idade: 1, 
      descricao: 'Calma e amorosa', 
      status: 'disponivel', 
      ong_id: 1,
      ong_nome: 'ONG Amigos dos Pets'
    },
    { 
      id: 3, 
      nome: 'Thor', 
      especie: 'cachorro', 
      raca: 'Labrador', 
      idade: 3, 
      descricao: 'Adora crianças e passeios', 
      status: 'disponivel', 
      ong_id: 1,
      ong_nome: 'ONG Amigos dos Pets'
    }
  ],
  interesses: []
};

// ================== ROTAS DA API ==================

// 📍 PÁGINA INICIAL - CORRIGIDA
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API PetFinder Online!',
    endpoints: {
      animais: 'GET /api/animais',
      cadastrar_animal: 'POST /api/animais',
      interesses: 'POST /api/interesses',
      usuarios: 'POST /api/usuarios'
    },
    status: '✅ Funcionando no Render.com!'
  });
});

// 📍 LISTAR ANIMAIS - CORRIGIDA
app.get('/api/animais', (req, res) => {
  console.log('📦 Retornando animais:', database.animais.length);
  const animaisDisponiveis = database.animais.filter(animal => animal.status === 'disponivel');
  res.json(animaisDisponiveis);
});

// 📍 CADASTRAR ANIMAL - CORRIGIDA
app.post('/api/animais', (req, res) => {
  console.log('➕ Cadastrando animal:', req.body);
  const { nome, especie, raca, idade, descricao } = req.body;
  const novoAnimal = {
    id: database.animais.length + 1,
    nome,
    especie,
    raca: raca || '',
    idade: idade || 0,
    descricao: descricao || '',
    status: 'disponivel',
    ong_id: 1,
    ong_nome: 'ONG Amigos dos Pets'
  };
  database.animais.push(novoAnimal);
  res.json({ ...novoAnimal, message: 'Animal cadastrado com sucesso!' });
});

// 📍 DEMONSTRAR INTERESSE - CORRIGIDA
app.post('/api/interesses', (req, res) => {
  console.log('❤️ Registrando interesse:', req.body);
  const { animal_id, usuario_id } = req.body;
  const novoInteresse = {
    id: database.interesses.length + 1,
    animal_id,
    usuario_id,
    data_interesse: new Date().toISOString(),
    status: 'pendente'
  };
  database.interesses.push(novoInteresse);
  res.json({ ...novoInteresse, message: 'Interesse registrado com sucesso!' });
});

// 📍 CADASTRAR USUÁRIO - CORRIGIDA
app.post('/api/usuarios', (req, res) => {
  console.log('👤 Cadastrando usuário:', req.body);
  const { nome, email, tipo } = req.body;
  const novoUsuario = {
    id: database.usuarios.length + 1,
    nome,
    email,
    tipo: tipo || 'adotante'
  };
  database.usuarios.push(novoUsuario);
  res.json({ ...novoUsuario, message: 'Usuário cadastrado com sucesso!' });
});

// Rota fallback para evitar "Cannot GET"
app.get('*', (req, res) => {
  res.json({ 
    error: 'Rota não encontrada',
    available_routes: {
      home: 'GET /',
      animais: 'GET /api/animais',
      cadastrar_animal: 'POST /api/animais',
      interesses: 'POST /api/interesses', 
      usuarios: 'POST /api/usuarios'
    }
  });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 PETFINDER API RODANDO!`);
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌐 URL: https://petfinder-api.onrender.com`);
  console.log(`🐾 Endpoint animais: /api/animais`);
  console.log(`=================================`);
});
