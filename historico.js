// historico.js

// Quando o DOM estiver totalmente carregado, dispara a função pra buscar as listas
document.addEventListener("DOMContentLoaded", () => {
    carregarListasSalvas();
});

// Função para buscar as listas salvas no backend
function carregarListasSalvas() {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("Usuário não logado.");
        window.location.href = "login.html";
        return;
    }

    fetch(`http://localhost:3000/api/listasRoutes?usuarioId=${usuarioId}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro na resposta da API.");
      return response.json();
    })
    .then(listas => {
      renderizarListas(listas);
    })
    .catch(error => {
      console.error("Erro ao carregar listas:", error);
      alert("Erro ao carregar as listas.");
    });
}

// Função para renderizar as listas na tela
function renderizarListas(listas) {
    const listasDiv = document.getElementById("listasSalvas");
    const msgSemListas = document.getElementById("nenhumaListaMsg");
    
    // Limpa o conteúdo da div
    listasDiv.innerHTML = "";
    
    if (!listas || listas.length === 0) {
        // Se não houver nenhuma lista, exibe a mensagem
        msgSemListas.style.display = "block";
        return;
    } else {
        msgSemListas.style.display = "none";
    }
    
    // Para cada lista salva, cria um elemento com os detalhes básicos
    listas.forEach(lista => {
        // Cria um container para cada lista
        let divLista = document.createElement("div");
        divLista.classList.add("lista-item"); // Use a classe que você já estilizou (no CSS do index já tem .lista-item)
        
        // Formata a data de criação (caso queira exibir)
        // let dataCriacao = new Date(lista.dataCriacao).toLocaleDateString("pt-BR", {
        //     dateStyle: "short",
        //     timeStyle: "short"
        // });
        let data = new Date(lista.dataCriacao);
        let dataCriacao = `${data.toLocaleDateString('pt-BR')} ${data.toLocaleTimeString('pt-BR')}`;
        
        // Preenche o conteúdo do container da lista com nome e data,
        // e coloca um botão para ver os detalhes da lista
        divLista.innerHTML = `
            <h3>${lista.nomeLista}</h3>
            <p>${dataCriacao} — ${lista.itens.length} item(s)</p>
            <button onclick="verDetalhes('${lista._id}')">Ver Detalhes</button>
        `;
        
        listasDiv.appendChild(divLista);
    });
}

// Função para redirecionar para a página de detalhes passando o ID da lista via query string
function verDetalhes(listaId) {
    window.location.href = `detalhesListas.html?id=${listaId}`;
}
