// js/pages/cardapio.js
let dadosCardapioPage = {
    bebidas: [
        { id: 1, nome: 'Brahma Chopp',  descricao: 'CERVEJA (600ml)',        precoNormal: 12.00, precoSocio: 10.00 },
        { id: 2, nome: 'Refrigerante',  descricao: 'LATA (350ml)',            precoNormal: 6.00,  precoSocio: 5.00  },
        { id: 3, nome: 'Água Mineral',  descricao: 'GARRAFA (500ml)',         precoNormal: 4.00,  precoSocio: 3.00  },
        { id: 4, nome: 'Suco Natural',  descricao: 'COPO (300ml)',            precoNormal: 8.00,  precoSocio: 6.50  },
        { id: 5, nome: 'Energético',    descricao: 'LATA (250ml)',            precoNormal: 10.00, precoSocio: 8.50  }
    ],
    petiscos: [
        { id: 6,  nome: 'Batatinha',    descricao: 'PORÇÃO DE BATATA FRITA',  precoNormal: 25.00, precoSocio: 20.00 },
        { id: 7,  nome: 'Calabresa',    descricao: 'PORÇÃO ACEBOLADA',        precoNormal: 30.00, precoSocio: 25.00 },
        { id: 8,  nome: 'Frango',       descricao: 'ISCA DE FRANGO GRELHADO', precoNormal: 28.00, precoSocio: 22.00 },
        { id: 9,  nome: 'Mandioca',     descricao: 'PORÇÃO COM MOLHO',        precoNormal: 22.00, precoSocio: 18.00 },
        { id: 10, nome: 'Mix de Frios', descricao: 'QUEIJO, PRESUNTO E SALAME', precoNormal: 35.00, precoSocio: 28.00 }
    ],
    pratos: [
        { id: 11, nome: 'Feijoada',          descricao: 'PRATO COMPLETO (SERVE 2)',        precoNormal: 45.00, precoSocio: 35.00 },
        { id: 12, nome: 'Prato Feito',        descricao: 'OPÇÃO INDIVIDUAL',               precoNormal: 20.00, precoSocio: 18.00 },
        { id: 13, nome: 'Frango com Arroz',   descricao: 'GRELHADO COM ARROZ E SALADA',    precoNormal: 24.00, precoSocio: 20.00 },
        { id: 14, nome: 'Filé à Parmegiana', descricao: 'COM ARROZ E BATATA FRITA',        precoNormal: 38.00, precoSocio: 30.00 }
    ]
};

const formataMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function carregarCardapio() {
    try {
        const res = await fetch('http://localhost:3000/api/cardapio');
        if (res.ok) dadosCardapioPage = await res.json();
    } catch (e) {
        console.log('Back-end offline. Usando dados mockados.');
    }

    renderizarLista('page-lista-bebidas',  dadosCardapioPage.bebidas);
    renderizarLista('page-lista-petiscos', dadosCardapioPage.petiscos);
    renderizarLista('page-lista-pratos',   dadosCardapioPage.pratos);
}

function renderizarLista(idLista, itens) {
    const ul = document.getElementById(idLista);
    if (!ul) return;

    ul.innerHTML = '';

    itens.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cardapio-page-item';

        li.innerHTML = `
            <div class="item-info">
                <span class="item-nome">${item.nome}</span>
                <span class="item-descricao">${item.descricao}</span>
            </div>
            <div class="tabela-precos">
                <span class="col-socio">${formataMoeda(item.precoSocio)}</span>
                <span class="col-divisor">|</span>
                <span class="col-normal">${formataMoeda(item.precoNormal)}</span>
            </div>
        `;

        ul.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', carregarCardapio);
