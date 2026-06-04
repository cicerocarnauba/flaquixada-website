class Bolao extends HTMLElement {
    async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch('./components_html/bolao.html');
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="./css/components/bolao.css">
        ${htmlPuro}
      `;

    } catch (error) {
      console.error('Erro ao carregar o HTML do Bolao:', error);
    }
}}

customElements.define('bolao-fla', Bolao);