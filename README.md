# API REST Login

Uma API REST simples de login com funcionalidades de autenticação e testes automatizados, desenvolvida para estudos de Teste de Software.

## 🚀 Funcionalidades

### 1. Login com Sucesso
- Autenticação com email e senha
- Geração de token JWT
- Retorno de dados do usuário

### 2. Login Inválido
- Validação de credenciais incorretas
- Contagem de tentativas restantes
- Mensagens de erro apropriadas

### 3. Bloquear Senha Após 3 Tentativas
- Bloqueio automático após 3 tentativas inválidas
- Período de bloqueio de 15 minutos
- Contagem regressiva do tempo restante

### 4. Lembrar Senha
- Solicitação de recuperação por email
- Validação de usuário existente
- Simulação de envio de email

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **Swagger** - Documentação da API
- **Mocha** - Framework de testes
- **Supertest** - Testes de integração
- **Chai** - Biblioteca de asserções

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd api-rest-login
```

2. Instale as dependências:
```bash
npm install
```

## 🚀 Como Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

### Testes
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📚 Documentação da API

A documentação interativa da API está disponível através do Swagger:

**URL:** `http://localhost:3000/api-docs`

### Endpoints Disponíveis

#### POST `/api/auth/login`
Realizar login do usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "Usuário Teste"
  }
}
```

#### POST `/api/auth/remember-password`
Solicitar lembrança de senha.

**Body:**
```json
{
  "email": "user@example.com"
}
```

#### GET `/api/auth/verify-token`
Verificar se o token é válido.

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/health`
Verificar status da API.

## 🧪 Testes Automatizados

O projeto inclui testes automatizados para todas as funcionalidades principais:

### 1. Testes de Login com Sucesso
- ✅ Login com credenciais válidas
- ✅ Validação de campos obrigatórios

### 2. Testes de Login Inválido
- ✅ Credenciais incorretas
- ✅ Email inexistente
- ✅ Contagem de tentativas restantes

### 3. Testes de Bloqueio de Conta
- ✅ Bloqueio após 3 tentativas
- ✅ Manutenção do bloqueio com credenciais corretas
- ✅ Desbloqueio após período de tempo

### 4. Testes de Lembrar Senha
- ✅ Recuperação para usuário existente
- ✅ Validação de email obrigatório
- ✅ Usuário inexistente

### 5. Testes de Verificação de Token
- ✅ Token válido
- ✅ Token ausente
- ✅ Token inválido

## 📊 Cobertura de Testes

Os testes cobrem os seguintes cenários:

- **Cenários de Sucesso:** Login válido, recuperação de senha
- **Cenários de Erro:** Credenciais inválidas, campos obrigatórios
- **Cenários de Segurança:** Bloqueio de conta, validação de token
- **Cenários de Validação:** Dados de entrada, formatos de resposta

## 🔐 Dados de Teste

**Usuário padrão para testes:**
- **Email:** `user@example.com`
- **Senha:** `password`

## 📁 Estrutura do Projeto

```
api-rest-login/
├── src/
│   ├── app.js                 # Aplicação principal
│   ├── config/
│   │   └── swagger.js         # Configuração do Swagger
│   ├── controllers/
│   │   └── authController.js  # Controlador de autenticação
│   ├── models/
│   │   └── User.js           # Modelo de usuário
│   └── routes/
│       └── auth.js           # Rotas de autenticação
├── test/
│   └── auth.test.js          # Testes automatizados
├── package.json
├── .mocharc.json             # Configuração do Mocha
└── README.md
```

## 🔧 Configurações

### Variáveis de Ambiente
- `PORT` - Porta do servidor (padrão: 3000)
- `JWT_SECRET` - Chave secreta para JWT (configurada no código)

### Configurações de Segurança
- **Máximo de tentativas:** 3
- **Tempo de bloqueio:** 15 minutos
- **Expiração do token:** 24 horas

## 🚨 Observações Importantes

⚠️ **Este projeto é destinado apenas para estudos de Teste de Software e não deve ser usado em produção.**

- Os dados são armazenados em memória (não há persistência)
- A chave JWT está hardcoded no código
- Não há validação robusta de entrada
- Não há rate limiting implementado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.