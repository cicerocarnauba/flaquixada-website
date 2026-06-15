// Dados iniciais (vão servir de fallback se a API do Express falhar/estiver offline)
let dadosCardapio = {
    bebidas: [
        { id: 1, nome: 'Brahma Chopp', descricao: 'CERVEJA (600ml)', precoNormal: 12.00, precoSocio: 10.00, categoria: 'bebidas' },
        { id: 2, nome: 'Refrigerante', descricao: 'LATA (350ml)', precoNormal: 6.00, precoSocio: 5.00, categoria: 'bebidas' }
    ],
    petiscos: [
        { id: 3, nome: 'Batatinha', descricao: 'PORÇÃO DE BATATA FRITA', precoNormal: 25.00, precoSocio: 20.00, categoria: 'petiscos' },
        { id: 4, nome: 'Calabresa', descricao: 'PORÇÃO ACEBOLADA', precoNormal: 30.00, precoSocio: 25.00, categoria: 'petiscos' }
    ],
    pratos: [
        { id: 5, nome: 'Feijoada', descricao: 'PRATO COMPLETO (SERVE 2)', precoNormal: 45.00, precoSocio: 35.00, categoria: 'pratos' },
        { id: 6, nome: 'Prato Feito', descricao: 'OPÇÃO INDIVIDUAL', precoNormal: 20.00, precoSocio: 18.00, categoria: 'pratos' }
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

            //mock
            const user = JSON.parse(localStorage.getItem('user'));
            const isAdmin = user && user.role === 'admin';

            await this.carregarDadosDaAPI();

            this.renderizarLista('lista-bebidas', dadosCardapio.bebidas, isAdmin);
            this.renderizarLista('lista-petiscos', dadosCardapio.petiscos, isAdmin);
            this.renderizarLista('lista-pratos', dadosCardapio.pratos, isAdmin);

            if (isAdmin) {
                this.configurarModoAdmin();
            }

        } catch (erro) {
            console.error("Erro ao renderizar CardCardapio:", erro);
        }
    }

    async carregarDadosDaAPI() {
        try {
            const res = await fetch('http://localhost:3000/api/cardapio');
            if (res.ok) {
                dadosCardapio = await res.json();
            }
        } catch (e) {
            console.log("Back-end offline. Usando dados mockados.");
        }
    }

    renderizarLista(idLista, itens, isAdmin, limite = 3) {
        const ul = this.querySelector(`#${idLista}`);
        if (!ul) return;

        ul.innerHTML = '';
        const itensLimitados = itens.slice(0, limite);

        itensLimitados.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cardapio-item';
            
            const formataMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            let acoesAdmin = '';
            if (isAdmin) {
                acoesAdmin = `
                    <div class="admin-acoes" style="margin-left: 10px; display: inline-flex; gap: 8px; align-items: center;">
                        <button class="btn-edit" title="Editar" style="cursor:pointer; background:none; border:none; padding:0; font-size: 14px;">✏️</button>
                        <button class="btn-delete" title="Deletar" style="cursor:pointer; background:none; border:none; padding:0; font-size: 14px;">❌</button>
                    </div>
                `;
            }

            li.innerHTML = `
                <div class="item-info">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-descricao">${item.descricao}</span>
                </div>
                <div class="tabela-precos">
                    <span class="col-socio preco-destaque">${formataMoeda(item.precoSocio)}</span>
                    <span class="col-divisor">|</span>
                    <span class="col-normal preco-comum">${formataMoeda(item.precoNormal)}</span>
                    ${acoesAdmin}
                </div>
            `;

            if (isAdmin) {
                li.querySelector('.btn-edit').addEventListener('click', () => this.abrirModalForm(item));
                li.querySelector('.btn-delete').addEventListener('click', () => this.deletarItem(item.id));
            }

            ul.appendChild(li);
        });
    }

    configurarModoAdmin() {
        const btnNovo = this.querySelector('#btn-novo-item');
        if (btnNovo) {
            btnNovo.style.display = 'block';
            btnNovo.addEventListener('click', () => this.abrirModalForm());
        }

        if (!document.getElementById('modal-cardapio')) {
            const modalHTML = `
                <div id="modal-cardapio" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); justify-content: center; align-items: center; z-index: 9999; color: black;">
                    <div style="background: white; padding: 25px; border-radius: 8px; width: 320px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        <h3 id="modal-titulo" style="margin-top:0;">Adicionar Item</h3>
                        <form id="form-cardapio-modal" style="display: flex; flex-direction: column; gap: 10px;">
                            <input type="hidden" id="form-id">
                            <label>Nome:</label><input type="text" id="form-nome" required>
                            <label>Descrição:</label><input type="text" id="form-desc" required>
                            <label>Preço Sócio:</label><input type="number" step="0.01" id="form-pSocio" required>
                            <label>Preço Normal:</label><input type="number" step="0.01" id="form-pNormal" required>
                            <label>Categoria:</label>
                            <select id="form-cat">
                                <option value="bebidas">Bebidas</option>
                                <option value="petiscos">Petiscos</option>
                                <option value="pratos">Pratos</option>
                            </select>
                            <div style="display:flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                                <button type="button" id="btn-fechar-modal" style="padding: 5px 10px;">Cancelar</button>
                                <button type="submit" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px;">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            
            document.getElementById('btn-fechar-modal').addEventListener('click', () => {
                document.getElementById('modal-cardapio').style.display = 'none';
            });

            document.getElementById('form-cardapio-modal').addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.salvarItem();
            });
        }
    }

    abrirModalForm(item = null) {
        const modal = document.getElementById('modal-cardapio');
        document.getElementById('form-cardapio-modal').reset();

        if (item) {
            document.getElementById('modal-titulo').innerText = "Editar Item";
            document.getElementById('form-id').value = item.id;
            document.getElementById('form-nome').value = item.nome;
            document.getElementById('form-desc').value = item.descricao;
            document.getElementById('form-pSocio').value = item.precoSocio;
            document.getElementById('form-pNormal').value = item.precoNormal;
            document.getElementById('form-cat').value = item.categoria;
        } else {
            document.getElementById('modal-titulo').innerText = "Adicionar Item";
            document.getElementById('form-id').value = '';
        }
        modal.style.display = 'flex';
    }

    async salvarItem() {
        const id = document.getElementById('form-id').value;
        const user = JSON.parse(localStorage.getItem('user'));

        const capitalizarNome = (str) => {
            return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
        };

        const itemDados = {
            
            nome: capitalizarNome(document.getElementById('form-nome').value.trim()),
            
            descricao: document.getElementById('form-desc').value.trim().toUpperCase(),
            
            precoSocio: parseFloat(document.getElementById('form-pSocio').value),
            precoNormal: parseFloat(document.getElementById('form-pNormal').value),
            categoria: document.getElementById('form-cat').value
        };

        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3000/api/cardapio/${id}` : 'http://localhost:3000/api/cardapio';

        try {
            await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(itemDados)
            });
        } catch (e) {
            console.log("Mockando ação de Salvar localmente");
            if (id) {
                const cat = itemDados.categoria;
                dadosCardapio[cat] = dadosCardapio[cat].map(i => i.id == id ? { ...itemDados, id: Number(id) } : i);
            } else {
                const cat = itemDados.categoria;
                itemDados.id = Date.now();
                dadosCardapio[cat].push(itemDados);
            }
        }

        document.getElementById('modal-cardapio').style.display = 'none';
        this.connectedCallback();
    }

    async deletarItem(id) {
        if (!confirm("Deseja mesmo excluir esse item do cardápio?")) return;

        const user = JSON.parse(localStorage.getItem('user'));

        try {
            await fetch(`http://localhost:3000/api/cardapio/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
        } catch (e) {
            console.log("Mockando ação de Deletar localmente");
            for (let cat in dadosCardapio) {
                dadosCardapio[cat] = dadosCardapio[cat].filter(item => item.id !== id);
            }
        }

        this.connectedCallback(); 
    }
}

customElements.define('card-cardapio', CardCardapio);
