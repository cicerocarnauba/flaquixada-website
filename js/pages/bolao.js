import { fetchJogos } from '../services/ApiJogosService.js';
import '../components/navbar.js';
import '../components/Bolao.js';
import '../components/NextGame.js';
import '../components/CardNextGame.js';
import '../components/Footer.js';

function getBolaoState() {
    return localStorage.getItem('bolao_mock_state') || 'INATIVO';
}

function getBolaoJogadores() {
    const saved = localStorage.getItem('bolao_mock_jogadores');
    if (saved) return JSON.parse(saved);
    
    // Default de segurança
    const iniciais = [];
    for(let i=1; i<=10; i++) iniciais.push({ id: i, nomeJogador: "", participante: "" });
    return iniciais;
}

function saveBolaoJogadores(jogadores) {
    localStorage.setItem('bolao_mock_jogadores', JSON.stringify(jogadores));
}

function renderBolaoState() {
    const container = document.getElementById('bolao-dynamic-container');
    if (!container) return;

    const state = getBolaoState();

    if (state === 'INATIVO') {
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-lock-2-line"></i>
                <h2>Bolão Inativo</h2>
                <p>O bolão para essa partida logo mais será aberto, fique de olho!</p>
            </div>
        `;
    } else if (state === 'AGUARDANDO') {
        container.innerHTML = `
            <div class="bolao-empty-state">
                <i class="ri-clipboard-line"></i>
                <h2>Aguardando Escalação</h2>
                <p>Estamos fazendo o sorteio da escalação do bolão, em breve divulgaremos!</p>
            </div>
        `;
    } else if (state === 'ABERTO') {
        container.innerHTML = `
            <div class="bolao-participants-list" id="bolao-participants-list"></div>
            
            <div class="bolao-insert-area" id="bolao-insert-area">
                <p class="bolao-blind-bet-text">Faça sua aposta às cegas:</p>
                <select id="select-jogador" class="bolao-novo-input bolao-novo-input-margin"></select>
                <input type="text" id="novo-participante-nome" class="bolao-novo-input" placeholder="Digite seu nome completo">
                <button id="btn-bolao-salvar" class="btn-bolao btn-bolao-salvar">
                    <i class="ri-check-line"></i> Confirmar Aposta</button>
            </div>
        `;
        renderBolaoList(state);
        
        const btnSalvar = document.getElementById('btn-bolao-salvar');
        if (btnSalvar) btnSalvar.addEventListener('click', salvarAposta);
    } else if (state === 'FECHADO') {
        container.innerHTML = `
            <div class="bolao-revelados-header">
                <h3><i class="ri-eye-line"></i> Jogadores Revelados!</h3>
                <p>As apostas estão encerradas. Confira qual o seu jogador!</p>
            </div>
            <div class="bolao-participants-list" id="bolao-participants-list"></div>
        `;
        renderBolaoList(state);
    }
}

function renderBolaoList(state) {
    const list = document.getElementById('bolao-participants-list');
    const select = document.getElementById('select-jogador'); 
    if (!list) return;

    list.innerHTML = '';
    if (select) {
        select.innerHTML = '<option value="" disabled selected>Escolha um número disponível...</option>';
    }

    const jogadores = getBolaoJogadores();

    jogadores.forEach(j => {
        const row = document.createElement('div');
        row.className = 'bolao-participant-row';
        
        const isTaken = j.participante && j.participante.trim().length > 0;
        
        // LÓGICA PRINCIPAL: Se ABERTO, esconde o nome real. Se FECHADO, revela.
        const nomeParaMostrar = state === 'FECHADO' 
            ? (j.nomeJogador || 'Jogador Não Preenchido pelo Admin') 
            : `Jogador ${j.id}`;

        row.innerHTML = `
            <div class="bolao-player-info">
                <span class="bolao-player-name">${nomeParaMostrar}</span>
            </div>
            <div class="bolao-participant-info">
                ${isTaken ? `<span class="bolao-participant-name taken"><i class="ri-user-check-fill"></i> ${j.participante}</span>` : `<span class="bolao-participant-name free">Disponível</span>`}
            </div>
        `;
        list.appendChild(row);

        // Se está livre e estamos na fase de apostas, adiciona ao select
        if (!isTaken && select) {
            const option = document.createElement('option');
            option.value = j.id;
            option.textContent = `Jogador ${j.id}`;
            select.appendChild(option);
        }
    });
}

function salvarAposta() {
    const select = document.getElementById('select-jogador');
    const inputNome = document.getElementById('novo-participante-nome');
    
    if (!select || !inputNome) return;

    const jogadorId = parseInt(select.value);
    const participanteNome = inputNome.value.trim();

    if (!jogadorId) {
        alert('Por favor, selecione uma vaga disponível na lista.');
        return;
    }

    if (!participanteNome) {
        alert('Por favor, digite seu nome completo para confirmar a aposta.');
        return;
    }

    const jogadores = getBolaoJogadores();
    const jogador = jogadores.find(j => j.id === jogadorId);
    
    if (jogador) {
        // Validação extra caso a vaga já tenha sido pega (útil para quando tivermos banco de dados real)
        if (jogador.participante && jogador.participante.trim() !== '') {
            alert('Ops! Alguém acabou de pegar essa vaga. Escolha outra.');
            renderBolaoState(); 
            return;
        }

        jogador.participante = participanteNome;
        saveBolaoJogadores(jogadores);
        
        inputNome.value = '';
        renderBolaoState();
        alert(`Aposta confirmada no Jogador ${jogador.id}! Boa sorte, o nome real será revelado em breve!`);
    }
}

// Escuta por mudanças no localStorage feitas por outras abas (Painel Admin)
// Isso permite que você atualize o admin e a página pública reaja quase em tempo real (F5 manual não é necessário se implementar evento storage, mas vamos forçar um reload visual)
window.addEventListener('storage', (e) => {
    if (e.key === 'bolao_mock_state' || e.key === 'bolao_mock_jogadores') {
        renderBolaoState();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    // Renderiza o bolão com o estado atual
    renderBolaoState();

    // Carrega e renderiza o Próximo Jogo
    const containerPrincipal = document.getElementById('bolao-jogo-atual');
    if (!containerPrincipal) return;

    const loader = document.createElement('div');
    loader.innerHTML = '<p style="text-align: center; color: white;">Carregando jogo...</p>';
    containerPrincipal.appendChild(loader);

    try {
        const jogosDaRodada = await fetchJogos();
        containerPrincipal.innerHTML = ''; 

        if (jogosDaRodada.length > 0) {
            const savedGameId = localStorage.getItem('bolao_mock_game_id');
            let jogosOrdenados = [...jogosDaRodada];

            // Se o admin selecionou um jogo específico para o bolão, forçamos ele a ser o primeiro
            if (savedGameId) {
                const targetGameId = Number(savedGameId);
                const gameIndex = jogosOrdenados.findIndex(j => j.id === targetGameId);
                
                if (gameIndex > -1) {
                    const selectedGame = jogosOrdenados.splice(gameIndex, 1)[0];
                    jogosOrdenados.unshift(selectedGame); // Coloca na primeira posição
                }
            }

            const cardDestaque = new CardNextGame(jogosOrdenados);
            cardDestaque.setAttribute('custom-title', 'Faça sua aposta');
            cardDestaque.setAttribute('custom-icon', 'ri-trophy-line');
            containerPrincipal.appendChild(cardDestaque);
        } else {
            containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Nenhum jogo disponível no momento.</p>';
        }
    } catch (error) {
        containerPrincipal.innerHTML = '<p style="text-align: center; color: white;">Erro ao carregar o jogo.</p>';
        console.error("Erro renderizando CardNextGame:", error);
    }
});