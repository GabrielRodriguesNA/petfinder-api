const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Banco de dados em memória (simples e eficaz)
let database = {
  usuarios: [
    { id: 1, nome: 'ONG Amigos dos Pets', email: 'ong@email.com', tipo: 'ong' },
    { id: 2, nome: 'João Silva', email: 'joao@email.com', tipo: 'adotante' }
  ],
  animais: [
    { id: 1, nome: 'Rex', especie: 'cachorro', raca: 'Vira-lata', idade: 2, descricao: 'Muito brincalhão', status: 'disponivel', ong_id: 1 },
    { id: 2, nome: 'Mimi', especie: 'gato', raca: 'Siamês', idade: 1, descricao: 'Calma e amorosa', status: 'disponivel', ong_id: 1 },
    { id: 3, nome: 'Thor', especie: 'cachorro', raca: 'Labrador', idade: 3, descricao: 'Adora passeios', status: 'disponivel', ong_id: 1 }
  ],
  interesses: []
};

// ================== ROTAS DA API ==================

// 📍 PÁGINA INICIAL
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API PetFinder Online!',
    endpoints: {
      animais: 'GET /animais',
      cadastrar_animal: 'POST /animais',
      interesses: 'POST /interesses',
      usuarios: 'POST /usuarios'
    }
  });
});

// 📍 LISTAR ANIMAIS
app.get('/animais', (req, res) => {
  const animaisComONG = database.animais
    .filter(animal => animal.status === 'disponivel')
    .map(animal => {
      const ong = database.usuarios.find(u => u.id === animal.ong_id);
      return {
        ...animal,
        ong_nome: ong ? ong.nome : 'ONG'
      };
    });
  res.json(animaisComONG);
});

// 📍 CADASTRAR ANIMAL
app.post('/animais', (req, res) => {
  const { nome, especie, raca, idade, descricao } = req.body;
  const novoAnimal = {
    id: database.animais.length + 1,
    nome,
    especie,
    raca: raca || '',
    idade: idade || 0,
    descricao: descricao || '',
    status: 'disponivel',
    ong_id: 1
  };
  database.animais.push(novoAnimal);
  res.json({ ...novoAnimal, message: 'Animal cadastrado!' });
});

// 📍 DEMONSTRAR INTERESSE
app.post('/interesses', (req, res) => {
  const { animal_id, usuario_id } = req.body;
  const novoInteresse = {
    id: database.interesses.length + 1,
    animal_id,
    usuario_id,
    data_interesse: new Date().toISOString(),
    status: 'pendente'
  };
  database.interesses.push(novoInteresse);
  res.json({ ...novoInteresse, message: 'Interesse registrado!' });
});

// 📍 CADASTRAR USUÁRIO
app.post('/usuarios', (req, res) => {
  const { nome, email, tipo } = req.body;
  const novoUsuario = {
    id: database.usuarios.length + 1,
    nome,
    email,
    tipo: tipo || 'adotante'
  };
  database.usuarios.push(novoUsuario);
  res.json({ ...novoUsuario, message: 'Usuário cadastrado!' });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
