# Lista Ligeira

Lista Ligeira é um aplicativo web responsivo desenvolvido como um Progressive Web App (PWA), voltado para ajudar usuários a organizarem suas listas de compras de forma prática, acessível e eficiente. O projeto foi idealizado dentro da disciplina Coding: Mobile e tem como diferencial o uso de funcionalidades modernas como geolocalização, armazenamento em nuvem (MongoDB Atlas) e autenticação de usuários.

## 🏠 Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Service Worker (PWA)
- Manifest.json

### Backend
- Node.js
- Express.js
- MongoDB Atlas (via Mongoose)
- dotenv
- cors
- body-parser

### Deploy
- Frontend: Netlify
- Backend: Render
- Banco de dados: MongoDB Atlas

---

## ⚙️ Funcionalidades do Projeto

### ✅ Cadastro e Login
- Criação de contas com nome, email e senha
- Armazenamento seguro no MongoDB Atlas
- Login com persistência de sessão via `localStorage`

### 📅 Criação de Listas
- Nome personalizado da lista
- Adição de produtos com nome, quantidade e preço unitário
- Cálculo automático do total de cada item
- Registro da localização (latitude/longitude) caso permitido pelo usuário

### ✨ Visualização e Ações
- Tela com histórico de listas
- Detalhamento de cada lista salva
- Função de duplicar lista
- Função de exclusão

### 🚪 Logout
- Opção de sair da conta e limpar localStorage

### 📱 PWA
- App pode ser instalado no celular
- Funciona offline (cache de arquivos estáticos)
- Roda como um aplicativo mobile (standalone)

---

## 🔎 Estrutura do Projeto

```bash
/backend
  |- controllers/
  |- models/
  |- routes/
  |- server.js
  |- .env

/frontend
  |- index.html
  |- novaLista.html
  |- historicoListas.html
  |- detalhesListas.html
  |- login.html
  |- cadastro.html
  |- app.js
  |- historico.js
  |- detalhes.js
  |- login.js
  |- cadastro.js
  |- styles.css
  |- service-worker.js
  |- manifest.json
```

---

## 🚩 Como Executar Localmente

1. Clone o repositório
2. Instale as dependências do backend:
```bash
cd backend
npm install
```
3. Configure seu `.env` com sua string do MongoDB Atlas:
```
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/listas
```
4. Rode o servidor backend:
```bash
npm run dev
```
5. Abra o `index.html` no navegador para testar o frontend

---

## 🌟 Diferenciais

- Projeto responsivo com boa usabilidade
- Armazenamento em nuvem com autenticação
- PWA com funcionamento offline
- Cadastro geolocalizado de listas
- Backend desacoplado pronto para integração com outros frontends

---

## 📄 Licença
Este projeto foi desenvolvido para fins acadêmicos e de aprendizado.

---

Feito com carinho por Pérola 💖

