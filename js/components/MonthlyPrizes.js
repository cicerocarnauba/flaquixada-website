class MonthlyPrizes extends HTMLElement {
    async connectedCallback() {
        try {
            // Busca o arquivo HTML atualizado
            const response = await fetch('./components_html/monthlyPrizes.html');
            const pureHtml = await response.text();

            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/monthlyPrizes.css">
                ${pureHtml}
            `;

            this.setupButton();

        } catch (error) {
            console.error('Erro ao carregar o HTML do monthly-prizes:', error);
        }
    }

    setupButton() {
        const btnCompete = this.querySelector('#btn-compete');
        if (btnCompete) {
            btnCompete.addEventListener('click', () => {
                window.open('https://wa.me/88981942857', '_blank');
            });
        }
    }
}

customElements.define('monthly-prizes', MonthlyPrizes);