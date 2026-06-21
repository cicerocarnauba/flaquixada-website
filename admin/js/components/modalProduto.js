class ModalProduto extends HTMLElement {
    constructor() {
        super();
        this.htmlCarregado = false;
        this.deveAbrirImediatamente = false;
    }

    async connectedCallback() {
        try {
            // Busca o HTML do modal
            const response = await fetch('./components_html/modalProduto.html');
            
            if (!response.ok) {
                throw new Error(`Não foi possível carregar o arquivo HTML. Status: ${response.status}`);
            }

            const pureHtml = await response.text();
            this.innerHTML = pureHtml;

            // Configura os seletores e cliques internos
            this.configurarEventosVisuais();
            this.htmlCarregado = true;

            // Se o usuário clicou no botão "Novo Item" antes do fetch terminar, abre o modal agora
            if (this.deveAbrirImediatamente) {
                this.abrirModal();
            }

        } catch (error) {
            console.error('Erro crítico ao carregar modal de produto:', error);
        }
    }

    configurarEventosVisuais() {
        const modal = this.querySelector('#modal-produto');
        const btnFechar = this.querySelector('#btn-fechar-modal-produto');
        const btnCancelar = this.querySelector('#btn-cancelar-produto');
        const inputImagem = this.querySelector('#produto-imagem');
        const preview = this.querySelector('#preview-imagem-produto');
        const form = this.querySelector('#form-produto');

        // Preview da imagem
        inputImagem?.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (!arquivo) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                if (preview) preview.src = event.target.result;
            };
            reader.readAsDataURL(arquivo);
        });

        // Envio do formulário
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário enviado com sucesso!');
            this.fecharModal();
        });

        // Eventos para fechar
        btnFechar?.addEventListener('click', () => this.fecharModal());
        btnCancelar?.addEventListener('click', () => this.fecharModal());
    }

    abrirModal() {
        const modal = this.querySelector('#modal-produto');
        
        if (this.htmlCarregado && modal) {
            modal.style.display = 'flex';
            this.deveAbrirImediatamente = false;
        } else {
            // Se o HTML ainda não carregou, avisa o componente para abrir assim que terminar
            this.deveAbrirImediatamente = true;
        }
    }

    fecharModal() {
        const modal = this.querySelector('#modal-produto');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

customElements.define('modal-produto', ModalProduto);