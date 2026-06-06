const dadosCardapio = {
    bebidas: [
        { nome: 'Brahma Chopp', descricao: 'CERVEJA (600ml)', precoNormal: 12.00, precoSocio: 10.00 },
        { nome: 'Refrigerante', descricao: 'LATA (350ml)', precoNormal: 6.00, precoSocio: 5.00 }
    ],
    petiscos: [
        { nome: 'Batatinha', descricao: 'PORÇÃO DE BATATA FRITA', precoNormal: 25.00, precoSocio: 20.00 },
        { nome: 'Calabresa', descricao: 'PORÇÃO ACEBOLADA', precoNormal: 30.00, precoSocio: 25.00 }
    ],
    pratos: [
        { nome: 'Feijoada', descricao: 'PRATO COMPLETO (SERVE 2)', precoNormal: 45.00, precoSocio: 35.00 },
        { nome: 'Prato Feito', descricao: 'OPÇÃO INDIVIDUAL', precoNormal: 20.00, precoSocio: 18.00 }
    ]
};

class CardCardapio extends HTMLElement {
    async connectedCallback() {
        try {
            const resposta = await fetch('./components_html/cardCardapio.html');
            const htmlPuro = await resposta.text();
            
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/cardCardapio.css">
                ${htmlPuro}
            `;

            this.renderizarLista('lista-bebidas', dadosCardapio.bebidas);
            this.renderizarLista('lista-petiscos', dadosCardapio.petiscos);
            this.renderizarLista('lista-pratos', dadosCardapio.pratos);

        } catch (erro) {
            console.error("Erro ao renderizar CardCardapio:", erro);
        }
    }

    renderizarLista(idLista, itens, limite = 3) {
        const ul = this.querySelector(`#${idLista}`);
        if (!ul) return;

        const itensLimitados = itens.slice(0, limite);

        itensLimitados.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cardapio-item';
            
            const formataMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            li.innerHTML = `
                <div class="item-info">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-descricao">${item.descricao}</span>
                </div>
                <div class="tabela-precos">
                    <span class="col-socio preco-destaque">${formataMoeda(item.precoSocio)}</span>
                    <span class="col-divisor">|</span>
                    <span class="col-normal preco-comum">${formataMoeda(item.precoNormal)}</span>
                </div>
            `;
            ul.appendChild(li);
        });
    }
}

customElements.define('card-cardapio', CardCardapio);
