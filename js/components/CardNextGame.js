class CardNextGame extends HTMLElement {
    //recebe a lista completa de jogos
    constructor(listaJogos) {
        super();
        this.listaJogos = listaJogos || [];
    }

    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardNextGame.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardNextGame.css">
                ${htmlPuro}
            `;
            
            if (this.listaJogos.length > 0) {
                // Separa o primeiro jogo do resto da lista
                const [primeiroJogo, ...jogosSeguintes] = this.listaJogos;
                
                //Preenche os dados do jogo principal de destaque
                this.querySelector('#team-home-name').textContent = primeiroJogo.timeCasa;
                this.querySelector('#team-home-img').src = primeiroJogo.escudoCasa;
                this.querySelector('#team-visiting-name').textContent = primeiroJogo.timeFora;
                this.querySelector('#team-visiting-img').src = primeiroJogo.escudoFora;
                this.querySelector('#championship').textContent = primeiroJogo.campeonato;
                this.querySelector('#stage').textContent = primeiroJogo.faseRodada;
                this.querySelector('#time').textContent = primeiroJogo.horario;
                this.querySelector('#stadium').textContent = primeiroJogo.estadio;
                this.querySelector('#date-day').textContent = primeiroJogo.diaSemana;
                this.querySelector('#date').textContent = primeiroJogo.dataExtenso;
                
                // 2. Renderiza a lista de próximos jogos
                const blocoLista = this.querySelector('#see-more-block');
                if (blocoLista) {
                    jogosSeguintes.forEach((jogo, index) => {
                        const itemLista = new NextGame(jogo);
                        blocoLista.appendChild(itemLista);
                        
                        // Cria e adiciona a linha divisória (hr)
                        if (index < jogosSeguintes.length - 1) {
                            const divisor = document.createElement('hr');
                            divisor.className = 'lista-jogos-divisor'; 
                            blocoLista.appendChild(divisor);
                        }
                    });
                }
            }

            this.configurarBotaoVerMais();

        } catch (error) {
            console.error('Erro ao carregar o HTML do card-next-game:', error);
        }
    }

    configurarBotaoVerMais() {
        const btnVerMais = this.querySelector('#btn-see-more-next-game');
        const blocoLista = this.querySelector('#see-more-block');

        if (btnVerMais && blocoLista) {
            btnVerMais.addEventListener('click', () => {
                blocoLista.classList.toggle('expandido');
                
                const estaExpandido = blocoLista.classList.contains('expandido');
                btnVerMais.innerHTML = estaExpandido 
                    ? `Ver Menos <i class="ri-arrow-up-s-line"></i>` 
                    : `Ver Mais <i class="ri-arrow-down-s-line"></i>`;
            });
        }
    }
}

customElements.define('card-next-game', CardNextGame);