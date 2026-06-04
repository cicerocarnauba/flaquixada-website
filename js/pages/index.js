/* Jogos Testes */
const proximosJogosMock = [
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 21",
    "timeCasa": "FLAMENGO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "ADVERSÁRIO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "19:00",
    "estadio": "Maracanã",
    "diaSemana": "SÁBADO",
    "dataExtenso": "24 DE MAIO",
    "dataFormatada": "24/05/2026"
  },
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 24",
    "timeCasa": "FLAMENGO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "ADVERSÁRIO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "19:00",
    "estadio": "Maracanã",
    "diaSemana": "TERÇA-FEIRA",
    "dataExtenso": "12 DE MAIO",
    "dataFormatada": "12/05/2026"
  },
  {
    "campeonato": "Brasileirão",
    "faseRodada": "Rodada 25",
    "timeCasa": "ADVERSÁRIO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "FLAMENGO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "21:30",
    "estadio": "Allianz Parque",
    "diaSemana": "SÁBADO",
    "dataExtenso": "16 DE MAIO",
    "dataFormatada": "16/05/2026"
  },
  {
    "campeonato": "Copa do Brasil",
    "faseRodada": "Semi-final",
    "timeCasa": "ADVERSÁRIO",
    "escudoCasa": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "timeFora": "FLAMENGO",
    "escudoFora": "https://images.seeklogo.com/logo-png/5/2/flamengo-logo-png_seeklogo-55627.png",
    "horario": "21:30",
    "estadio": "Castelão",
    "diaSemana": "QUARTA-FEIRA",
    "dataExtenso": "20 DE MAIO",
    "dataFormatada": "20/05/2026"
  }
];



document.addEventListener('DOMContentLoaded', () => {
    // 1. Onde os componentes clonados entrarão
    const containerPrincipal = document.getElementById('match-fla');

    if (!containerPrincipal || proximosJogosMock.length === 0) return;

    // 2. Destrincha o array: o primeiro vai pro topo, o resto vira lista
    const [primeiroJogo, ...jogosSeguintes] = proximosJogosMock;

    // 3. Renderiza o Card de Destaque no topo
    const cardDestaque = new CardNextGame(primeiroJogo);
    containerPrincipal.appendChild(cardDestaque);

    // 4. Aguarda um microssegundo para injetar a lista dentro da div interna "see-more-block" 
    // que você deixou mapeada no seu HTML do cardNextGame
    requestAnimationFrame(() => {
        const blocoLista = cardDestaque.querySelector('#see-more-block');
        
        if (blocoLista) {
        jogosSeguintes.forEach((jogo, index) => {
            // Cria o componente do jogo e adiciona na lista
            const itemLista = new NextGame(jogo);
            blocoLista.appendChild(itemLista);

            // Se NÃO for o último jogo da lista, adiciona a linha divisória (hr)
            if (index < jogosSeguintes.length - 1) {
                const divisor = document.createElement('hr');
                
                // Opcional: Você pode adicionar uma classe para estilizar essa linha no CSS
                divisor.className = 'lista-jogos-divisor'; 
                
                blocoLista.appendChild(divisor);
            }
        });
    }
        
        // Configuração opcional do botão "Ver Mais / Ver Menos"
        const btnVerMais = cardDestaque.querySelector('#btn-see-more-next-game');
        if (btnVerMais && blocoLista) {
            btnVerMais.addEventListener('click', () => {
                blocoLista.classList.toggle('expandido');
                // Altera o texto/ícone conforme necessário para o comportamento "Ver Menos"
                const estaExpandido = blocoLista.classList.contains('expandido');
                btnVerMais.innerHTML = estaExpandido 
                    ? `Ver Menos <i class="ri-arrow-up-s-line"></i>` 
                    : `Ver Mais <i class="ri-arrow-down-s-line"></i>`;
            });
        }
    });
});