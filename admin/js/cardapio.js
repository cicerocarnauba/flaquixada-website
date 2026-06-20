document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Cardápio inicializado (Modo Visual).");
    
    const btnNovo = document.getElementById('btn-novo-item');

    // Funções de UI (Apenas visual, sem lógica de dados)
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            const componenteModal = document.querySelector('modal-cardapio');
            if(componenteModal && componenteModal.abrirModal) {
                componenteModal.abrirModal();
            }
        });
    }
});
