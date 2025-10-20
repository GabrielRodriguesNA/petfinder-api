// URL DA SUA API NO RENDER
const API_URL = 'https://petfinder-api-490h.onrender.com';

// 🐾 CARREGAR ANIMAIS AUTOMATICAMENTE
async function carregarAnimais() {
    try {
        console.log('🔄 Carregando animais de:', API_URL);
        const response = await fetch(`${API_URL}/animais`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const animais = await response.json();
        exibirAnimais(animais);
        
    } catch (error) {
        console.error('❌ Erro ao carregar animais:', error);
        const container = document.getElementById('animais-container');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffebee; border-radius: 8px;">
                    <p style="color: #d32f2f; font-size: 18px; margin-bottom: 10px;">❌ Erro ao carregar animais</p>
                    <p style="color: #666; margin-bottom: 20px;">Verifique o console para detalhes</p>
                    <button onclick="carregarAnimais()" class="btn-secondary">
                        🔄 Tentar Novamente
                    </button>
                </div>
            `;
        }
    }
}

// 🎨 EXIBIR ANIMAIS NA TELA
function exibirAnimais(animais, filtro = 'todos') {
    const container = document.getElementById('animais-container');
    
    if (!container) return;
    
    if (animais.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #666; margin-bottom: 20px;">
                    🐾 Nenhum animal disponível no momento.
                </p>
                <button onclick="cadastrarAnimal()" class="btn-secondary">
                    ➕ Cadastrar Primeiro Animal
                </button>
            </div>
        `;
        return;
    }
    
    // Aplicar filtro
    const animaisFiltrados = filtro === 'todos' 
        ? animais 
        : animais.filter(animal => animal.especie === filtro);
    
    if (animaisFiltrados.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p style="color: #666;">Nenhum ${filtro} disponível no momento.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = animaisFiltrados.map(animal => `
        <div class="animal-card">
            <div class="animal-image">
                ${animal.especie === 'cachorro' ? '🐕' : '🐈'}
            </div>
            <div class="animal-content">
                <h3>${animal.nome}</h3>
                <div class="animal-info">
                    <p><strong>Espécie:</strong> ${animal.especie}</p>
                    <p><strong>Raça:</strong> ${animal.raca || 'Sem raça definida'}</p>
                    <p><strong>Idade:</strong> ${animal.idade} anos</p>
                    <p><strong>Descrição:</strong> ${animal.descricao}</p>
                    <p style="color: #888; font-size: 14px; margin-top: 10px;">
                        <em>Cadastrado por: ${animal.ong_nome}</em>
                    </p>
                </div>
                <button onclick="demonstrarInteresse(${animal.id})" class="btn-adotar">
                    🐾 Tenho Interesse
                </button>
            </div>
        </div>
    `).join('');
    
    console.log(`✅ ${animaisFiltrados.length} animais exibidos!`);
}

// 🔍 FILTRAR ANIMAIS
function filtrarAnimais(filtro) {
    // Atualizar botões ativos
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Recarregar animais com filtro
    fetch(`${API_URL}/animais`)
        .then(response => response.json())
        .then(animais => exibirAnimais(animais, filtro))
        .catch(error => console.error('Erro ao filtrar:', error));
}

// ❤️ DEMONSTRAR INTERESSE EM ADOÇÃO
async function demonstrarInteresse(animalId) {
    const usuarioId = 2; // Temporário
    
    try {
        const response = await fetch(`${API_URL}/interesses`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                animal_id: animalId, 
                usuario_id: usuarioId 
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        alert('✅ ' + result.message);
        console.log('Interesse registrado:', result);
        
    } catch (error) {
        console.error('❌ Erro ao demonstrar interesse:', error);
        alert('❌ Erro: ' + error.message);
    }
}

// ➕ CADASTRAR NOVO ANIMAL
async function cadastrarAnimal() {
    const nome = prompt('Nome do animal:');
    if (!nome) return;
    
    const especie = prompt('Espécie (cachorro/gato):', 'cachorro');
    const raca = prompt('Raça:', 'Vira-lata');
    const idade = prompt('Idade:', '2');
    const descricao = prompt('Descrição:', 'Muito amoroso');
    
    try {
        const response = await fetch(`${API_URL}/animais`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nome, 
                especie, 
                raca, 
                idade: parseInt(idade), 
                descricao
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        alert('✅ ' + result.message);
        carregarAnimais(); // Recarrega a lista
        
    } catch (error) {
        console.error('❌ Erro ao cadastrar animal:', error);
        alert('❌ Erro: ' + error.message);
    }
}

// 📱 INICIAR QUANDO PÁGINA CARREGAR
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PetFinder Iniciado!');
    carregarAnimais();
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
