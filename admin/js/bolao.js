// Módulos globais do painel
import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import { fetchJogos } from '../../js/services/ApiJogosService.js';
import '../../js/components/NextGame.js';
import '../../js/components/CardNextGame.js';

let currentState = 'INATIVO';
let loadedJogos = [];

document.addEventListener('DOMContentLoaded', () => {
    inicializarToggleJogadores();
    inicializarEstadoBolao();
    renderizarInputsJogadores();

    const btnSalvar = document.getElementById('btn-salvar-jogadores');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', salvarJogadoresMock);
    }

    const btnZerar = document.getElementById('btn-zerar-apostas');
    if (btnZerar) {
        btnZerar.addEventListener('click', zerarApostasMock);
    }

    const btnEmbaralhar = document.getElementById('btn-embaralhar-jogadores');
    if (btnEmbaralhar) {
        btnEmbaralhar.addEventListener('click', embaralharJogadores);
    }

    inicializarSelecaoJogo();
});

function inicializarToggleJogadores() {
    const btnToggle = document.getElementById('btn-toggle-jogadores');
    const content = document.getElementById('content-jogadores');

    if (btnToggle && content) {
        btnToggle.addEventListener('click', () => {
            btnToggle.classList.toggle('active');
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
}

function inicializarEstadoBolao() {
    // Carrega o estado atual do localStorage (Mock do banco)
    const savedState = localStorage.getItem('bolao_mock_state');
    if (savedState) {
        currentState = savedState;
    } else {
        localStorage.setItem('bolao_mock_state', currentState);
    }

    atualizarUIEstado();

    const btnsState = document.querySelectorAll('.btn-state');
    btnsState.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newState = e.currentTarget.getAttribute('data-state');
            mudarEstadoBolao(newState);
        });
    });
}

function mudarEstadoBolao(newState) {
    if (currentState === newState) return;
    
    // Regra: se mudar para ABERTO, os jogadores devem estar definidos
    // Aqui assumimos que o Admin já salvou os nomes.
    
    currentState = newState;
    localStorage.setItem('bolao_mock_state', currentState);
    atualizarUIEstado();
    
    alert(`Estado do bolão alterado para: ${newState}`);
}

function atualizarUIEstado() {
    // Atualiza a Label e a Badge
    const lblEstado = document.getElementById('lbl-estado-atual');
    const lblDesc = document.getElementById('lbl-estado-desc');
    
    if (!lblEstado || !lblDesc) return;

    // Reseta classes
    lblEstado.className = 'badge-estado';
    
    const btnsState = document.querySelectorAll('.btn-state');
    btnsState.forEach(btn => btn.classList.remove('active'));

    const btnAtivo = document.querySelector(`.btn-state[data-state="${currentState}"]`);
    if (btnAtivo) btnAtivo.classList.add('active');

    if (currentState === 'INATIVO') {
        lblEstado.textContent = 'INATIVO';
        lblEstado.classList.add('inativo');
        lblDesc.textContent = 'O bolão está fechado e aguardando configuração.';
    } else if (currentState === 'ABERTO') {
        lblEstado.textContent = 'ABERTO (Apostas)';
        lblEstado.classList.add('aberto');
        lblDesc.textContent = 'O bolão está liberado! Usuários podem escolher seus números às cegas.';
    } else if (currentState === 'FECHADO') {
        lblEstado.textContent = 'FECHADO (Revelado)';
        lblEstado.classList.add('fechado');
        lblDesc.textContent = 'Apostas encerradas! Os nomes dos jogadores foram revelados para o público.';
    }
}

function carregarJogadoresMock() {
    const saved = localStorage.getItem('bolao_mock_jogadores');
    if (saved) {
        return JSON.parse(saved);
    }
    // Padrão inicial vazio
    const iniciais = [];
    for(let i=1; i<=10; i++) iniciais.push({ id: i, nomeJogador: "", participante: "" });
    return iniciais;
}

function renderizarInputsJogadores() {
    const container = document.getElementById('bolao-jogadores-container');
    if (!container) return;

    const jogadores = carregarJogadoresMock();
    container.innerHTML = '';

    jogadores.forEach((j, index) => {
        const row = document.createElement('div');
        row.className = 'bolao-jogador-row';
        
        row.innerHTML = `
            <div class="bolao-jogador-number">${index + 1}</div>
            <div class="bolao-jogador-input-group">
                <label>Jogador ${index + 1}</label>
                <input type="text" class="input-jogador" id="jogador-input-${index+1}" placeholder="Nome do Jogador ${index+1}" value="${j.nomeJogador || ''}">
            </div>
        `;
        
        container.appendChild(row);
    });
}

function salvarJogadoresMock() {
    const jogadores = [];
    for(let i=1; i<=10; i++) {
        const input = document.getElementById(`jogador-input-${i}`);
        jogadores.push({
            id: i,
            nomeJogador: input ? input.value.trim() : '',
            participante: '' // Resetar o participante se quiser, ou manter? No mock vamos só salvar o nome.
        });
    }

    // Para evitar apagar os participantes ao editar o nome, vamos mesclar
    const old = carregarJogadoresMock();
    for(let i=0; i<10; i++) {
        jogadores[i].participante = old[i].participante || '';
    }

    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
    alert("Lista de jogadores salva com sucesso! O bolão pode ser aberto.");
}

function zerarApostasMock() {
    if(!confirm("Tem certeza que deseja apagar todas as apostas dos usuários?")) return;
    
    const jogadores = carregarJogadoresMock();
    jogadores.forEach(j => j.participante = "");
    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
    
    // Volta para inativo automaticamente
    mudarEstadoBolao('INATIVO');
    
    alert("Todas as apostas foram apagadas. O bolão voltou para INATIVO.");
}

async function inicializarSelecaoJogo() {
    const select = document.getElementById('select-jogo-bolao');
    const btnSalvar = document.getElementById('btn-salvar-jogo');
    if (!select || !btnSalvar) return;

    try {
        loadedJogos = await fetchJogos();
        select.innerHTML = '<option value="" style="background: #1a1a1a; color: #ffffff; padding: 10px;">Selecione o Jogo do Bolão</option>';

        loadedJogos.forEach(jogo => {
            const option = document.createElement('option');
            option.value = jogo.id;
            option.style.background = '#1a1a1a';
            option.style.color = '#ffffff';
            option.style.padding = '10px';
            
            // Formatacao ultra clean: Campeonato - Time x Time (Data)
            const dataCurta = jogo.dataFormatada.substring(0, 5); 
            option.textContent = `${jogo.campeonato}: ${jogo.timeCasa} x ${jogo.timeFora} (${dataCurta})`;
            
            select.appendChild(option);
        });

        const previewBlock = document.getElementById('admin-preview-game');
        const previewContainer = document.getElementById('admin-preview-game-container');

        const renderPreview = (gameId) => {
            if (!previewBlock || !previewContainer) return;
            if (!gameId) {
                previewBlock.style.display = 'none';
                return;
            }
            
            const selectedGame = loadedJogos.find(j => j.id == gameId);
            if (selectedGame) {
                previewContainer.innerHTML = '';
                // Instancia o componente com apenas este jogo
                const cardDestaque = new CardNextGame([selectedGame]);
                previewContainer.appendChild(cardDestaque);
                previewBlock.style.display = 'block';
            } else {
                previewBlock.style.display = 'none';
            }
        };

        // Tentar selecionar o que já está salvo
        const savedGameId = localStorage.getItem('bolao_mock_game_id');
        if (savedGameId) {
            select.value = savedGameId;
            renderPreview(savedGameId);
        }

        select.addEventListener('change', (e) => {
            renderPreview(e.target.value);
        });

        btnSalvar.addEventListener('click', () => {
            if (select.value) {
                localStorage.setItem('bolao_mock_game_id', select.value);
                alert('Jogo salvo com sucesso! O bolão agora exibirá este jogo como destaque.');
                renderPreview(select.value);
            } else {
                alert('Selecione um jogo válido.');
            }
        });

    } catch (error) {
        select.innerHTML = '<option value="">Erro ao carregar jogos</option>';
        console.error("Erro inicializando seleção de jogo:", error);
    }
}

function embaralharJogadores() {
    const inputs = [];
    for(let i=1; i<=10; i++) {
        const el = document.getElementById(`jogador-input-${i}`);
        if (el && el.value.trim() !== '') {
            inputs.push({ index: i, value: el.value.trim() });
        }
    }

    if (inputs.length < 2) {
        alert("Preencha pelo menos 2 jogadores para poder embaralhar.");
        return;
    }

    const originalPositions = inputs.map(item => item.index);
    let shuffledValues = [];
    let attempts = 0;
    let derangement = false;

    // Tenta encontrar um derangement (onde nenhum elemento fica na posição original)
    while (!derangement && attempts < 100) {
        attempts++;
        shuffledValues = [...inputs];
        
        for (let i = shuffledValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledValues[i], shuffledValues[j]] = [shuffledValues[j], shuffledValues[i]];
        }

        derangement = true;
        for (let i = 0; i < shuffledValues.length; i++) {
            if (shuffledValues[i].index === originalPositions[i]) {
                derangement = false;
                break;
            }
        }
    }

    // Aplica os valores embaralhados de volta aos inputs originais
    for(let i = 0; i < inputs.length; i++) {
        const el = document.getElementById(`jogador-input-${originalPositions[i]}`);
        el.value = shuffledValues[i].value;
    }
}

console.log("Interface visual de Gerenciar Bolão carregada com sucesso.");
