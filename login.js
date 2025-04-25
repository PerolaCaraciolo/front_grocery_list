const baseURL = "https://back-grocery-list.onrender.com";

function mostrarLogin() {
    document.getElementById("formLogin").classList.remove("hidden");
    document.getElementById("formCadastro").classList.add("hidden");
    document.getElementById("btnLogin").classList.add("active");
    document.getElementById("btnCadastro").classList.remove("active");
  }
  
  function mostrarCadastro() {
    document.getElementById("formCadastro").classList.remove("hidden");
    document.getElementById("formLogin").classList.add("hidden");
    document.getElementById("btnCadastro").classList.add("active");
    document.getElementById("btnLogin").classList.remove("active");
  }
  
  function cadastrarUsuario(event) {
    event.preventDefault();
  
    const nome = document.getElementById("cadastroNome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();
  
    fetch(`${baseURL}/api/usuarios/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensagem || "Conta criada com sucesso!");
      mostrarLogin();
    })
    .catch(err => {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar. Tente novamente.");
    });
  }
  
  function logarUsuario(event) {
    event.preventDefault();
  
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();
  
    fetch(`${baseURL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.usuarioId) {
        alert("Login bem-sucedido!");
        localStorage.setItem("usuarioId", data.usuarioId);
        localStorage.setItem("nomeUsuario", data.nome);
        window.location.href = "novaLista.html"; // redireciona pro app
      } else {
        alert(data.mensagem || "Erro ao logar.");
      }
    })
    .catch(err => {
      console.error("Erro ao logar:", err);
      alert("Erro ao fazer login.");
    });
  }
  