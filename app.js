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