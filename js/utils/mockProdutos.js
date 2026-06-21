export const DADOS_PRODUTOS_MOCK = [
    { id: 1, nome: 'Camisa Oficial Manto 1', descricao: 'Modelo Torcedor 2026', preco: 349.90, imagem: '' },
    { id: 2, nome: 'Camisa Oficial Manto 2', descricao: 'Modelo Branca Clássica', preco: 349.90, imagem: '' },
    { id: 3, nome: 'Boné Fla-Quixadá', descricao: 'Aba curva com ajuste', preco: 79.90, imagem: '' },
    { id: 4, nome: 'Copo Térmico', descricao: 'Inox 473ml com abridor', preco: 120.00, imagem: '' },
    { id: 5, nome: 'Chaveiro Oficial', descricao: 'Metal resinado com o escudo', preco: 15.00, imagem: '' }
];

// Inicializa o mock no localStorage caso não exista
export function inicializarMockProdutos() {
    const dadosSalvos = localStorage.getItem('produtos_mock');
    if (!dadosSalvos) {
        localStorage.setItem('produtos_mock', JSON.stringify(DADOS_PRODUTOS_MOCK));
    }
}

export function obterProdutosLocal() {
    inicializarMockProdutos(); // Garante que foi inicializado
    const dados = localStorage.getItem('produtos_mock');
    return JSON.parse(dados);
}

export function salvarProdutosLocal(dados) {
    localStorage.setItem('produtos_mock', JSON.stringify(dados));
}

// Executa automaticamente ao importar o arquivo para garantir os dados iniciais
inicializarMockProdutos();