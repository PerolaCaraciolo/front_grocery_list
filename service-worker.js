// Para tornar minha aplicação em um PWA, preciso dos ícones de tamanhos diferentes, do MANIFEST e do SERVICE-WORKER

// O MANIFEST contem as informações básicas do projeto, inclusive os apontamentos pros ícones
// Eu só preciso chamar o meu arquivo MANIFEST.JASON no meu INDEX!
// E lá em baixo dele (ainda no body) eu instalo o meu SERVICE-WORKER!


// Aqui eu consigo passar todos os arquivos de frontend que eu quero que funcionem quando a minha aplicação não estiver com internet
// (é o apoio no gerenciamento do cache desse projeto)
// O que preciso pra que minha aplicação seja instalável!

const CACHE_NAME = "lista-v2";
const urlsToCache = [
    "/",
    "./index.html",
    "./novaLista.html",
    "./historicoListas.html",
    "./detalhesListas.html",
    "./styles.css",
    "./app.js",
    "./detalhes.js",
    "./historico.js",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

// INSTALAR o service worker e armazenar os arquivos no cache
self.addEventListener("install", (event) => {
    console.log("[ServiceWorker] Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[ServiceWorker] Arquivos em cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// ATIVAR e limpar caches antigos
self.addEventListener("activate", (event) => {
    console.log("[ServiceWorker] Ativado");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("[ServiceWorker] Limpando cache antigo:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// FETCH: interceptar requisições e responder com o cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Arquivo do cache
                }
                return fetch(event.request); // Requisição normal se não estiver no cache
            })
            .catch(() => {
                // Offline e sem cache? Pode exibir uma página offline opcional aqui.
                return caches.match('/index.html');
            })
    );
});
