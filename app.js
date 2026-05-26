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

// Busca / Filtro
function filtrarContatos() {
  const termo = inputBusca.value.toLowerCase().trim();
  const filtrados = todosContatos.filter(
    (c) =>
      (c.nome    && c.nome.toLowerCase().includes(termo))  ||
      (c.email   && c.email.toLowerCase().includes(termo)) ||
      (c.cidade  && c.cidade.toLowerCase().includes(termo))||
      (c.celular && c.celular.includes(termo))
  );
  exibirContatos(filtrados);
}

// Modo edição
function carregarEdicao(contato) {
  contatoEditandoId = contato.id;

  // Preencher campos
  document.getElementById("campo-nome").value     = contato.nome     || "";
  document.getElementById("campo-celular").value  = contato.celular  || "";
  document.getElementById("campo-email").value    = contato.email    || "";
  document.getElementById("campo-foto").value     = contato.foto     || "";
  document.getElementById("campo-endereco").value = contato.endereco || "";
  document.getElementById("campo-cidade").value   = contato.cidade   || "";

  // Atualizar avatar placeholder com foto do contato (se houver)
  atualizarAvatarPreview();

  // Atualizar textos do formulário
  formTitulo.textContent    = "Editando Contato";
  formSubtitulo.textContent = `Modificando: ${contato.nome}`;
  btnSalvar.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Salvar Alterações
  `;

  // Mostrar botão de cancelar edição, destacar formulário
  btnCancelarEd.classList.remove("hidden");
  document.querySelector(".form-section").classList.add("modo-edicao");

  // Scroll suave até o form
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById("campo-nome").focus(), 400);
}

function cancelarEdicao() {
  contatoEditandoId = null;
  formEl.reset();
  limparErros();
  resetarAvatarPreview();

  formTitulo.textContent    = "Novo Contato";
  formSubtitulo.textContent = "Preencha os dados para adicionar um contato";
  btnSalvar.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Criar Contato
  `;

  btnCancelarEd.classList.add("hidden");
  document.querySelector(".form-section").classList.remove("modo-edicao");
}

//Avatar placeholder dinâmico
function atualizarAvatarPreview() {
  const url = document.getElementById("campo-foto").value.trim();
  const inner = avatarPlaceholder.querySelector(".avatar-placeholder-inner");

  if (url && isUrl(url)) {
    // Mostrar imagem real no placeholder
    avatarPlaceholder.classList.add("tem-foto");
    inner.innerHTML = `<img src="${escaparHtml(url)}" alt="Pré-visualização" onerror="this.parentElement.parentElement.classList.remove('tem-foto');resetarAvatarPreviewFallback()">`;
  } else {
    resetarAvatarPreview();
  }
}

function resetarAvatarPreview() {
  avatarPlaceholder.classList.remove("tem-foto");
  const inner = avatarPlaceholder.querySelector(".avatar-placeholder-inner");
  inner.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
    <span>Foto</span>
  `;
}

// exposto globalmente para o onerror inline
window.resetarAvatarPreviewFallback = resetarAvatarPreview;

// Submit
async function handleSubmit(e) {
  e.preventDefault();
  limparErros();

  const dados = {
    nome:     document.getElementById("campo-nome").value.trim(),
    celular:  document.getElementById("campo-celular").value.trim(),
    email:    document.getElementById("campo-email").value.trim(),
    foto:     document.getElementById("campo-foto").value.trim(),
    endereco: document.getElementById("campo-endereco").value.trim(),
    cidade:   document.getElementById("campo-cidade").value.trim(),
  };

  if (!validarFormulario(dados)) return;

  btnSalvar.disabled = true;
  const textoOriginal = btnSalvar.innerHTML;
  btnSalvar.innerHTML = `<span class="spinner-btn"></span> Salvando…`;

  try {
    if (contatoEditandoId) {
      await atualizarContato(contatoEditandoId, dados);
      mostrarToast("Contato atualizado com sucesso!", "sucesso");
      cancelarEdicao();
    } else {
      await criarContato(dados);
      mostrarToast("Contato criado com sucesso!", "sucesso");
      formEl.reset();
      resetarAvatarPreview();
    }
    await renderizarContatos();
  } catch (err) {
    mostrarToast(err.message || "Ocorreu um erro. Tente novamente.", "erro");
    btnSalvar.innerHTML = textoOriginal;
  } finally {
    btnSalvar.disabled = false;
    if (!contatoEditandoId) {
      btnSalvar.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Criar Contato
      `;
    }
  }
}

//Deleção
function confirmarDelecao(contato) {
  const confirmEl = document.getElementById("confirm-dialog");
  document.getElementById("confirm-nome").textContent = contato.nome;

  confirmEl.classList.remove("hidden");
  requestAnimationFrame(() => confirmEl.classList.add("visivel"));

  const btnSim = document.getElementById("btn-confirmar-sim");
  const btnNao = document.getElementById("btn-confirmar-nao");

  const fecharConfirm = () => {
    confirmEl.classList.remove("visivel");
    setTimeout(() => confirmEl.classList.add("hidden"), 280);
    // Remover listeners clonando
    btnSim.replaceWith(btnSim.cloneNode(true));
    btnNao.replaceWith(btnNao.cloneNode(true));
  };

  document.getElementById("btn-confirmar-sim").addEventListener("click", async () => {
    fecharConfirm();
    await executarDelecao(contato.id);
  });
  document.getElementById("btn-confirmar-nao").addEventListener("click", fecharConfirm);
}

async function executarDelecao(id) {
  const card = listaEl.querySelector(`[data-id="${id}"]`);
  if (card) card.classList.add("saindo");

  // Se estava editando este contato, limpar o form
  if (contatoEditandoId === id) cancelarEdicao();

  try {
    await deletarContato(id);
    mostrarToast("Contato excluído.", "info");
    await renderizarContatos();
  } catch (err) {
    mostrarToast(err.message || "Erro ao excluir contato.", "erro");
    if (card) card.classList.remove("saindo");
  }
}

// Validação 
function validarFormulario(dados) {
  let valido = true;

  if (!dados.nome) {
    mostrarErro("campo-nome", "Nome é obrigatório.");
    valido = false;
  }

  if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    mostrarErro("campo-email", "E-mail inválido.");
    valido = false;
  }

  if (dados.foto && !isUrl(dados.foto)) {
    mostrarErro("campo-foto", "URL inválida.");
    valido = false;
  }

  return valido;
}

function mostrarErro(campoId, mensagem) {
  const campo = document.getElementById(campoId);
  campo.classList.add("campo-erro");
  const erro = document.createElement("span");
  erro.className = "erro-msg";
  erro.textContent = mensagem;
  campo.parentElement.appendChild(erro);
}

function limparErros() {
  document.querySelectorAll(".campo-erro").forEach((el) => el.classList.remove("campo-erro"));
  document.querySelectorAll(".erro-msg").forEach((el) => el.remove());
}

// Toast 
let toastTimer;
function mostrarToast(mensagem, tipo = "info") {
  clearTimeout(toastTimer);
  toastEl.textContent = mensagem;
  toastEl.className = `toast toast-${tipo} visivel`;
  toastTimer = setTimeout(() => toastEl.classList.remove("visivel"), 3500);
}

// Loading 
function mostrarLoading(ativo) {
  loadingEl.classList.toggle("hidden", !ativo);
  listaEl.classList.toggle("hidden", ativo);
}

//Utilitários 
function gerarIniciais(nome = "") {
  return nome.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");
}

function escaparHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}
