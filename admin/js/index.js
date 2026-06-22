import './components/AdminSidebar.js';
import './components/AdminHeader.js';
import { ApiCardapioService } from '../../js/services/ApiCardapioService.js';

renderDashboard();

async function renderDashboard() {
    const container = document.getElementById('dashboard-content');
    if (!container) return;

    // Busca o total de itens via API
    let totalCardapio = 0;
    try {
        const dadosCardapio = await ApiCardapioService.fetchCardapio();
        if (dadosCardapio) {
            totalCardapio = (dadosCardapio.bebidas?.length || 0) + 
                            (dadosCardapio.petiscos?.length || 0) + 
                            (dadosCardapio.pratos?.length || 0);
        }
    } catch(e) {
        console.error("Erro ao buscar total de cardápio da API", e);
    }

    // Lê o status do Bolão
    const bolaoStatus = localStorage.getItem('bolao_status') || 'INATIVO';

    // Dados que viriam do Backend
    const kpis = [
        { icone: 'ri-newspaper-line', valor: '12', label: 'Notícias Publicadas' },
        { icone: 'ri-restaurant-line', valor: totalCardapio.toString(), label: 'Itens no Cardápio' },
        { icone: 'ri-shopping-bag-line', valor: '8', label: 'Produtos na Loja' }
    ];

    const actions = [
        { link: 'noticias.html?action=novo-item', icone: 'ri-edit-box-line', label: 'Nova Notícia', isButton: false },
        { link: 'cardapio.html?action=novo-item', icone: 'ri-restaurant-line', label: 'Adicionar ao Cardápio', isButton: false },
        { link: 'loja.html?action=novo-produto', icone: 'ri-shopping-bag-line', label: 'Adicionar Produto na Loja', isButton: false }
    ];

    // Helpers para os botões de estado do bolão
    const classInativo = bolaoStatus === 'INATIVO' ? 'active btn-inativo' : '';
    const classAberto = bolaoStatus === 'ABERTO' ? 'active btn-aberto' : '';
    const classFechado = bolaoStatus === 'FECHADO' ? 'active btn-fechado' : '';

    // HTML dinâmico
    let html = `
        <div class="dashboard-stats">
            ${kpis.map(kpi => `
                <div class="stat-card">
                    <div class="stat-icon"><i class="${kpi.icone}"></i></div>
                    <div class="stat-info">
                        <span class="stat-value">${kpi.valor}</span>
                        <span class="stat-label">${kpi.label}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="dashboard-actions-section">
            <h3>Acesso Rápido</h3>
            
            <div class="dashboard-bolao-status">
                <div class="dashboard-bolao-status-header">
                    <h3 class="bolao-widget-title">
                        <span><i class="ri-trophy-line"></i> Status do Bolão:</span> 
                        <strong class="bolao-widget-status">${bolaoStatus}</strong>
                    </h3>
                    <a href="bolao.html" class="btn-secundary btn-manage-bolao"><i class="ri-settings-4-line"></i> Gerenciar</a>
                </div>
                
                <div class="bolao-state-buttons-group">
                    <button id="btn-dash-inativo" class="btn-state ${classInativo}"><i class="ri-lock-2-line"></i> Inativo</button>
                    <button id="btn-dash-aberto" class="btn-state ${classAberto}"><i class="ri-lock-unlock-line"></i> Aberto (Apostas)</button>
                    <button id="btn-dash-fechado" class="btn-state ${classFechado}"><i class="ri-eye-line"></i> Fechado (Revelado)</button>
                </div>
            </div>

            <div class="quick-actions">
                ${actions.map(action => {
                    return `
                        <a href="${action.link}" class="btn-quick-action">
                            <i class="${action.icone}"></i>
                            ${action.label}
                        </a>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Configura os eventos dos botões de estado do Bolão
    document.getElementById('btn-dash-inativo')?.addEventListener('click', () => {
        if(bolaoStatus !== 'INATIVO' && confirm('Deseja inativar o bolão?')) {
            localStorage.setItem('bolao_status', 'INATIVO');
            renderDashboard();
        }
    });

    document.getElementById('btn-dash-aberto')?.addEventListener('click', () => {
        if(bolaoStatus !== 'ABERTO' && confirm('Deseja abrir as apostas do bolão?')) {
            localStorage.setItem('bolao_status', 'ABERTO');
            renderDashboard();
        }
    });

    document.getElementById('btn-dash-fechado')?.addEventListener('click', () => {
        if(bolaoStatus !== 'FECHADO' && confirm('Deseja encerrar as apostas e revelar os jogadores?')) {
            localStorage.setItem('bolao_status', 'FECHADO');
            renderDashboard();
        }
    });
}
