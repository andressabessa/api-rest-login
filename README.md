# API REST Login

## Introdução

Este repositório contém uma API REST simples de autenticação de login, desenvolvida para fins de estudo e demonstração de práticas de testes automatizados (funcionais e de performance). O projeto não utiliza banco de dados, armazenando os dados em memória, e inclui exemplos de testes automatizados com Mocha/Supertest e testes de carga com K6.

Repositório: [https://github.com/andressabessa/api-rest-login](https://github.com/andressabessa/api-rest-login)

---

## Tecnologias utilizadas

- **Node.js** e **Express** — Backend da API REST
- **bcryptjs** — Hash de senhas
- **jsonwebtoken** — Autenticação JWT
- **Swagger** — Documentação automática da API
- **Mocha** e **Chai** — Testes automatizados (funcionais)
- **Supertest** — Testes de integração HTTP
- **K6** — Testes de performance/carga
- **Nodemon** — Hot reload em desenvolvimento

---

## Estrutura do repositório

```
api-rest-login/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── swagger.js
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── User.js
│   └── routes/
│       └── auth.js
├── test/
│   ├── functional/
│   │   └── login.test.js
│   └── performance/
│       └── login.perf.js
├── package.json
├── README.md
└── ...
```

---

## Objetivo de cada grupo de arquivos

- **src/**: Código-fonte da API.
  - **app.js**: Configuração principal do Express (middlewares, rotas, etc).
  - **server.js**: Inicialização do servidor (escuta na porta).
  - **config/**: Configurações auxiliares (ex: Swagger).
  - **controllers/**: Lógica dos endpoints.
  - **models/**: Modelos de dados em memória.
  - **routes/**: Definição das rotas da API.
- **test/functional/**: Testes automatizados de integração e comportamento da API usando Mocha, Chai e Supertest.
- **test/performance/**: Scripts de teste de carga/performance usando K6.
- **package.json**: Dependências e scripts do projeto.

---

## Modo de instalação e de execução do projeto

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/andressabessa/api-rest-login.git
cd api-rest-login
npm install
```

### 2. Execução da API

Para rodar a API em modo desenvolvimento (com hot reload):

```bash
npm run dev
```

Para rodar em modo produção:

```bash
npm start
```

Acesse a documentação Swagger em:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### 3. Execução dos testes funcionais

```bash
npm test
```

---

### 4. Execução dos testes de performance (K6)

Certifique-se de ter o [K6](https://k6.io/) instalado.

Para rodar o teste de performance e acompanhar o relatório em tempo real via dashboard web, execute:

```bash
K6_WEB_DASHBOARD=true k6 run test/performance/login.perf.js
```

Para exportar o relatório em HTML ao final do teste, use:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run test/performance/login.perf.js
```

O arquivo `html-report.html` será gerado ao final do teste.

---
