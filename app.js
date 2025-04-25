const baseURL = "https://back-grocery-list.onrender.com";

// Array para armazenar os produtos temporários antes de salvar a lista
let listaDeCompras = [];
let listaId = null;                                                                         // Identificador da lista em modo edição

// FUNÇÃO PARA MOSTRAR OU NÃO O MENU HAMBURGUER
function toggleMenu() {
    document.getElementById("mobile-menu").classList.toggle("open");                        // Busca pelo elemento "mobile-menu" e qdo acionado, abre ou fecha
    document.getElementById("menu-overlay").classList.toggle("show");                       // Fundo escuro por trás do menu hamburguer
}

document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const saudacao = document.getElementById("boasVindasMenu");
  
    if (saudacao && nomeUsuario) {
      saudacao.textContent = `Olá, ${nomeUsuario}!`;
    }
});

// LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// TRATAMENTO DO NOME DA LISTA
document.addEventListener("DOMContentLoaded", function () {
    let nomeLista = document.getElementById("nomeLista");
    if (nomeLista) {                                                                        // Só adiciona o event listener se o elemento existir
        nomeLista.addEventListener("click", editarNomeLista);
    }

    // Verifica se estou editando uma lista
    const params = new URLSearchParams(window.location.search);
    listaId = params.get("edit");

    if (listaId) {
        fetch(`${baseURL}/api/listasRoutes/${listaId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById("nomeLista").value = data.nomeLista;
                fixarNomeLista();
                listaDeCompras = data.itens;
                atualizarLista();
            })
            .catch(err => {
                alert("Erro ao carregar lista para edição.");
                console.error(err);
            });
    }
});

function fixarNomeLista() {
    let nomeListaInput = document.getElementById("nomeLista");

    // Se o campo estiver preenchido, torna ele "fixo"
    if (nomeListaInput.value.trim() !== "") {
        nomeListaInput.setAttribute("readonly", true);
        nomeListaInput.style.color = "#2E1A47"; // Destaca o texto
    }
}

function editarNomeLista() {
    let nomeListaInput = document.getElementById("nomeLista");
    nomeListaInput.removeAttribute("readonly");
    nomeListaInput.focus();
}


// FUNÇÃO PARA ADICIONAR PRODUTO À LISTA
function adicionarProduto(event) {
    event.preventDefault();                                                                 // Evita o submit do form
    let nomeProduto = document.getElementById("nomeProduto").value.trim();
    let quantidade = document.getElementById("quantidade").value || "1";                    // Se estiver vazio, assume 1
    let preco = document.getElementById("preco").value || "0";                              // Se não tiver preço, assume R$ 0,00
    
    // Validação básica
    // if (nomeProduto === "" || isNaN(quantidade) || isNaN(preco)) {     QDO EU IMPEDIA DE TUDO ESTAR VAZIO
    if (nomeProduto === "") {
        alert("Por favor, informe o nome do produto.");
        return;
    }

    // Impedir valores negativos
    if (quantidade < 1) quantidade = 1;
    if (preco < 0) preco = 0;

    // Criando objeto do produto
    let produto = {
        nomeProduto: nomeProduto,
        quantidade: parseInt(quantidade),
        preco: parseFloat(preco).toFixed(2),                                                // Deixa o preço com duas casas decimais
        total: (parseInt(quantidade) * parseFloat(preco)).toFixed(2)                        // Calcula o total do item
    };

    // Adiciona à lista
    listaDeCompras.push(produto);

    // Atualiza a exibição da lista
    atualizarLista();

    // Limpa os campos
    document.getElementById("nomeProduto").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("preco").value = "";
}


// FUNÇÃO PARA ATUALIZAR A LISTA NA TELA
function atualizarLista() {
    let listaUl = document.getElementById("listaProdutos");
    listaUl.innerHTML = "";                                                                 // Limpa a lista antes de atualizar

    listaDeCompras.forEach((produto, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${produto.quantidade}x ${produto.nomeProduto} - R$${produto.preco} 
            <strong>Total: R$${produto.total}</strong>
            <button type="button" onclick="removerProduto(${index})">❌</button>
        `;

        listaUl.appendChild(li);
    });
}


// FUNÇÃO PARA REMOVER UM PRODUTO DA LISTA
function removerProduto(index) {
    let confirmacao = confirm("Tem certeza que deseja remover este item?");
    if (confirmacao) {
        listaDeCompras.splice(index, 1);                                                    // Remove o item pelo índice
        atualizarLista();                                                                   // Atualiza a exibição
    }
}


// FUNÇÃO PARA SALVAR A LISTA
function salvarLista(event) {
    event.preventDefault();                                                                 // Evita o submit do form

    let nomeListaInput = document.getElementById("nomeLista").value.trim();
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("Usuário não logado.");
        window.location.href = "login.html";
        return;
    }

    if (nomeListaInput === "") {
        alert("Dê um nome para sua lista antes de salvar.");
        return;
    }

    if (listaDeCompras.length === 0) {
        alert("Adicione pelo menos um item à lista.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
    
          const novaLista = {
            nomeLista: nomeListaInput,
            itens: listaDeCompras,
            usuarioId,
            localizacao: {
              latitude,
              longitude
            }
          };
    
          enviarLista(novaLista);
        },
        (erro) => {
          console.warn("Localização não permitida ou erro:", erro.message);
    
          // Continua mesmo sem localização
          const novaLista = {
            nomeLista: nomeListaInput,
            itens: listaDeCompras,
            usuarioId
          };
    
          enviarLista(novaLista);
        }
    );
}

// Lógica isolada pra envio da lista pro backend
function enviarLista(lista) {
  const url = listaId
    ? `${baseURL}/api/listasRoutes/${listaId}`
    : `${baseURL}/api/listasRoutes`;

  const metodo = listaId ? "PUT" : "POST";

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lista)
  })
    .then(res => res.json())
    .then(data => {
      alert("Lista salva com sucesso!");
      window.location.href = "historicoListas.html";
    })
    .catch(err => {
      console.error("Erro ao salvar lista:", err);
      alert("Erro ao salvar lista. Tente novamente.");
    });
}