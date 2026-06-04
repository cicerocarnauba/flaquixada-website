class CardNextGame extends HTMLElement {
    constructor(jogoData) {
        super();
        this.jogo = jogoData;
    }

    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardNextGame.html');
            const htmlPuro = await resposta.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardNextGame.css">
                ${htmlPuro}
            `;

            if (this.jogo) {
                this.querySelector('#team-home-name').textContent = this.jogo.timeCasa;
                this.querySelector('#team-home-img').src = this.jogo.escudoCasa;
                this.querySelector('#team-visiting-name').textContent = this.jogo.timeFora;
                this.querySelector('#team-visiting-img').src = this.jogo.escudoFora;
                
                this.querySelector('#championship').textContent = this.jogo.campeonato;
                this.querySelector('#stage').textContent = this.jogo.faseRodada;
                this.querySelector('#time').textContent = this.jogo.horario;
                this.querySelector('#stadium').textContent = this.jogo.estadio;
                this.querySelector('#date-day').textContent = this.jogo.diaSemana;
                this.querySelector('#date').textContent = this.jogo.dataExtenso;
            }
        } catch (error) {
            console.error('Erro ao carregar o HTML do card-next-game:', error);
        }
    }
}

customElements.define('card-next-game', CardNextGame);