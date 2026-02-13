# Sistema Web de Gestão de Tarefas

Este projeto consiste em uma aplicação web simples desenvolvida como exercício prático de integração entre front-end e back-end, com o objetivo de consolidar conceitos fundamentais de desenvolvimento full stack.

A aplicação permite o gerenciamento básico de tarefas, contemplando operações de criação, listagem, edição e exclusão de registros, com persistência em banco de dados local.

---

## Objetivo

O projeto foi desenvolvido com a finalidade de aplicar, em um cenário prático, conhecimentos relacionados à construção de interfaces web, implementação de APIs e comunicação com banco de dados, servindo como material de apoio à formação em desenvolvimento full stack.

---

## Funcionalidades

* Cadastro de tarefas
* Listagem de registros
* Edição de tarefas existentes
* Remoção de tarefas
* Marcação de conclusão

---

## Tecnologias Utilizadas

### Front-end

* HTML
* CSS
* JavaScript (Fetch API)

### Back-end

* Node.js
* Express

### Banco de dados

* SQLite

---

## Estrutura do Projeto

```
task-manager/
├── backend/
│   ├── server.js
│   └── database.db
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

---

## Execução do Projeto

### Backend

Dentro da pasta `backend`:

```bash
npm install
node server.js
```

O servidor será iniciado em:

```
http://localhost:3333
```

---

### Frontend

Abrir o arquivo:

```
frontend/index.html
```

em um navegador ou utilizando Live Server.

---

## Considerações

Este projeto possui caráter educacional e foi desenvolvido com foco na compreensão dos fundamentos da arquitetura full stack, priorizando clareza de implementação e integração entre camadas da aplicação.
