# Desafio Front-end: CRUD de Contatos com API REST

**Instituição:** FATEC São Roque  
**Disciplina:** Programação de Sítios Internet  
**Professor:** Fernando Leonid

---

## Contexto
Este repositório foi preparado como base de atividade prática.
A ideia e praticar a integracao entre Front-end e API REST usando JavaScript puro (sem frameworks).

Nesta etapa, a camada de servico da API ja esta pronta no projeto.
Cada aluno deve dar fork neste repositorio e complementar a parte de interface e integracao no navegador.

## Objetivo da Atividade
Construir um front-end funcional para consumir a API de contatos, aplicando os conceitos de:
- arquitetura cliente-servidor
- requisicoes HTTP
- CRUD
- manipulacao de DOM
- organizacao de codigo em modulos

## API da Atividade
Endpoint base:
- https://bakcend-fecaf-render.onrender.com/contatos

Modelo de dados esperado:

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "celular": "(11) 99999-9999",
  "foto": "https://site.com/foto.jpg",
  "email": "maria@email.com",
  "endereco": "Rua A, 100",
  "cidade": "Sao Paulo"
}
```

## Estrutura Base do Projeto
- index.html
- style.css
- app.js
- contatos.js

Observacao:
- O arquivo contatos.js ja possui as funcoes de acesso a API (CRUD).
- O desafio e os alunos criarem o layout e integrarem a interface com essas funcoes.
- O aluno pode criar novos arquivos HTML, CSS e JS se achar necessario, mas nao pode excluir os arquivos base existentes.

## O que cada aluno deve fazer
1. Criar o HTML funcional (formulario e area de listagem).
2. Criar o CSS para organizar o layout.
3. Implementar no app.js a integracao com as funcoes do contatos.js.
4. Exibir lista de contatos na tela (GET).
5. Cadastrar novo contato via formulario (POST).
6. Atualizar contato existente (PUT).
7. Deletar contato (DELETE).

### Requisitos tecnicos
- Usar JavaScript puro (sem React, Vue, Angular etc.).
- Usar modulos ES (import/export).
- Usar async/await.
- Tratar erros de requisicao de forma visivel para o usuario.
- Renderizar imagem do contato via URL (campo foto).

## Escopo Obrigatorio
- CRUD completo: GET, POST, PUT e DELETE

## Escopo Extra (bonus)
- Melhorias de UX (mensagens, estados de carregamento, validacoes adicionais)

## Instrucoes de Fork e Entrega
1. Fazer fork deste repositorio para sua conta.
2. Clonar seu fork localmente.
3. Criar sua implementacao no HTML, CSS e app.js.
4. Fazer commits com mensagens claras.
5. Publicar no seu repositorio.
6. Enviar o link do fork como issue em: https://github.com/fernandoleonid/FATEC-atividades-Programa-o-de-S-tios-Internet-1-2026

![Exemplo de Issue](./issue.jpg)

## Checklist do Aluno
- [ ] Fiz o fork do repositorio.
- [ ] Fiz commits a cada funcionalidade (ou pelo menos um para cada aula).
- [ ] Meu projeto abre sem erros no navegador.
- [ ] Consigo listar contatos da API.
- [ ] Consigo cadastrar novo contato.
- [ ] Consigo atualizar contato da API.
- [ ] Consigo deletar contato da API.
- [ ] Minha interface possui formulario e listagem.
- [ ] Meu codigo esta organizado e legivel.
- [ ] Nao exclui os arquivos base do repositorio.
- [ ] Entreguei o link do repositorio.

---

## Pontuação
Esta atividade valerá **1 ponto na P2** caso:
- O projeto esteja funcionando (CRUD completo).
- Os commits sejam feitos a cada funcionalidade ou, no mínimo, um para cada aula.

---

## Suporte e Dúvidas
Qualquer dúvida sobre a atividade ou dificuldade técnica, entre em contato com o professor Fernando Leonid através do repositório principal:


Bom trabalho!

# FATEC-contatos-2026
