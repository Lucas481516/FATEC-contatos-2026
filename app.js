// app.js — Lógica principal da aplicação de contatos
import {
  listarContatos,
  criarContato,
  atualizarContato,
  deletarContato,
} from "./contatos.js";

// Estado global 
let contatoEditandoId = null;
let todosContatos = [];

// Seletores 
const listaEl        = document.getElementById("lista-contatos");
const formEl         = document.getElementById("form-contato");
const formTitulo     = document.getElementById("form-titulo");
const formSubtitulo  = document.getElementById("form-subtitulo");
const btnSalvar      = document.getElementById("btn-salvar");
const btnCancelarEd  = document.getElementById("btn-cancelar-edicao");
const inputBusca     = document.getElementById("busca");
const toastEl        = document.getElementById("toast");
const contadorEl     = document.getElementById("contador");
const loadingEl      = document.getElementById("loading");
const emptyEl        = document.getElementById("empty-state");
const avatarPlaceholder = document.querySelector(".avatar-placeholder");

// Inicialização 
document.addEventListener("DOMContentLoaded", async () => {
  await renderizarContatos();
  configurarEventos();
});

function configurarEventos() {
  formEl.addEventListener("submit", handleSubmit);
  btnCancelarEd.addEventListener("click", cancelarEdicao);
  inputBusca.addEventListener("input", filtrarContatos);
  // Atualizar avatar ao digitar URL da foto
  document.getElementById("campo-foto").addEventListener("input", atualizarAvatarPreview);
}

//Renderização 
async function renderizarContatos() {
  mostrarLoading(true);
  try {
    todosContatos = await listarContatos();
    exibirContatos(todosContatos);
  } catch (err) {
    mostrarToast("Erro ao carregar contatos. Verifique a conexão.", "erro");
    listaEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
    emptyEl.querySelector("p").textContent = "Não foi possível carregar os contatos.";
  } finally {
    mostrarLoading(false);
  }
}

function exibirContatos(contatos) {
  listaEl.innerHTML = "";

  if (contatos.length === 0) {
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");
    contatos.forEach((c, i) => {
      const card = criarCard(c);
      card.style.animationDelay = `${i * 60}ms`;
      listaEl.appendChild(card);
    });
  }

  contadorEl.textContent = `${contatos.length} contato${contatos.length !== 1 ? "s" : ""}`;
}

function criarCard(contato) {
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.id = contato.id;

  const iniciais = gerarIniciais(contato.nome);
  const fotoHtml = contato.foto
    ? `<img src="${escaparHtml(contato.foto)}" alt="${escaparHtml(contato.nome)}" class="card-foto" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : "";

  article.innerHTML = `
    <div class="card-avatar">
      ${fotoHtml}
      <div class="card-iniciais" style="${contato.foto ? "display:none" : ""}">
        ${iniciais}
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-nome">${escaparHtml(contato.nome)}</h3>
      <p class="card-detalhe">
        <span class="icon">📱</span>${escaparHtml(contato.celular || "—")}
      </p>
      <p class="card-detalhe">
        <span class="icon">✉️</span>${escaparHtml(contato.email || "—")}
      </p>
      <p class="card-detalhe">
        <span class="icon">📍</span>${escaparHtml(
          [contato.endereco, contato.cidade].filter(Boolean).join(", ") || "—"
        )}
      </p>
    </div>
    <div class="card-acoes">
      <button class="btn-editar" aria-label="Editar contato">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Editar
      </button>
      <button class="btn-deletar" aria-label="Excluir contato">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        Excluir
      </button>
    </div>
  `;

  article.querySelector(".btn-editar").addEventListener("click", () => carregarEdicao(contato));
  article.querySelector(".btn-deletar").addEventListener("click", () => confirmarDelecao(contato));

  return article;
}