class DivulgaSocioFla extends HTMLElement {
    async connectedCallback() {
    try {
      // Busca o arquivo HTML
      const resposta = await fetch('./components_html/divulgaSocioFla.html');
      const htmlPuro = await resposta.text();

      // Injeta o CSS e o HTML
      this.innerHTML = `
        <link rel="stylesheet" href="./css/components/divulgaSocioFla.css">
        ${htmlPuro}
      `;

    } catch (error) {
      console.error('Erro ao carregar o HTML do DivulgaSocioFla:', error);
    }
}}

customElements.define('div-socio-fla', DivulgaSocioFla);