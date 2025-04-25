// ===========================================
// detalhes.js - Gerencia a página de detalhes da lista
// ===========================================

const baseURL = "https://back-grocery-list.onrender.com";

// Variável global para armazenar os dados da lista carregada
let listaDetalhes = null;

// Função para pegar um parâmetro da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Função para buscar os detalhes da lista no backend
function carregarDetalhes() {
    // Pega o ID da lista (por exemplo: detalhesListas.html?id=12345)
    const listaId = getQueryParam("id");
    if (!listaId) {
        alert("Nenhum ID de lista informado na URL.");
        return;
    }

    // Faz o fetch para obter a lista
    fetch(`${baseURL}/api/listasRoutes/${listaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar os detalhes da lista: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            listaDetalhes = data; // Guarda os detalhes da lista na variável global
            renderizarDetalhes();
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Não foi possível carregar os detalhes da lista. Tente novamente.");
        });
}

// Função para renderizar os detalhes na tela
function renderizarDetalhes() {
    // Atualiza o título da lista e os itens
    const tituloListaElem = document.getElementById("tituloLista");
    const itensListaElem = document.getElementById("itensLista");

    if (!listaDetalhes) return;

    // Atualiza o título (pode exibir o nome da lista e, se quiser, a data)
    tituloListaElem.textContent = listaDetalhes.nomeLista;

    // Limpa a lista de itens
    itensListaElem.innerHTML = "";

    // Se não tiver nenhum item, você pode mostrar uma mensagem opcional
    if (!listaDetalhes.itens || listaDetalhes.itens.length === 0) {
        itensListaElem.innerHTML = "<li>Nenhum item nesta lista.</li>";
        return;
    }

    // Para cada item da lista, cria um <li> com as informações
    listaDetalhes.itens.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.quantidade}x ${item.nomeProduto} - R$${parseFloat(item.preco).toFixed(2)}
            <strong>Total: R$${parseFloat(item.total).toFixed(2)}</strong>
        `;
        itensListaElem.appendChild(li);
    });
}

// Função para duplicar a lista
function duplicarLista() {
    if (!listaDetalhes) return;

    // Cria uma cópia da lista removendo possíveis identificadores que o backend gere automaticamente
    const novaLista = {
        nomeLista: listaDetalhes.nomeLista + " (cópia)",
        itens: listaDetalhes.itens,
        // Não precisa mandar dataCriacao nem _id, já que o backend define automaticamente
    };

    fetch(`${baseURL}/api/listasRoutes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaLista)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao duplicar a lista: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert("Lista duplicada com sucesso!");
        // Opcionalmente, redireciona para a página de histórico ou detalhes do novo item
        window.location.href = "./historicoListas.html";
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao duplicar a lista. Tente novamente.");
    });
}

// Função para editar a lista
function editarLista() {
    if (!listaDetalhes) return;
    // Redireciona para a página de criação/edição, passando o ID da lista na query string
    window.location.href = `novaLista.html?edit=${listaDetalhes._id}`;
}

// Função para excluir a lista
function excluirLista() {
    if (!listaDetalhes) return;
    
    const confirmacao = confirm("Tem certeza que deseja excluir essa lista?");
    if (!confirmacao) return;
    
    fetch(`${baseURL}/api/listasRoutes/${listaDetalhes._id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao excluir a lista: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert("Lista excluída com sucesso!");
        window.location.href = "./historicoListas.html";
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao excluir a lista. Tente novamente.");
    });
}

// Quando o DOM carregar, chama a função de carregar detalhes
document.addEventListener("DOMContentLoaded", () => {
    carregarDetalhes();
});
