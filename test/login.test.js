const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');
const User = require('../src/models/User');

describe('API REST Login - Testes de Autenticação', () => {
  let authToken;

  // Limpar dados antes de cada teste
  beforeEach(() => {
    // Resetar o usuário de teste para estado inicial
    const testUser = User.findByEmail('user@example.com');
    if (testUser) {
      User.resetLoginAttempts(testUser);
    }
  });

  describe('1. Login com Sucesso', () => {
    it('deve realizar login com credenciais válidas', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Login realizado com sucesso');
      expect(response.body).to.have.property('token').that.is.a('string');
      expect(response.body).to.have.property('user').that.is.an('object');
      expect(response.body.user).to.have.property('email', 'user@example.com');
      expect(response.body.user).to.have.property('name', 'Usuário Teste');

      // Salvar token para outros testes
      authToken = response.body.token;
    });

    it('deve retornar erro 400 quando email ou senha não são fornecidos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com' })
        .expect(400);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'VALIDATION_ERROR');
      expect(response.body).to.have.property('message', 'Email e senha são obrigatórios');
    });
  });

  describe('2. Login Inválido', () => {
    it('deve retornar erro 401 com credenciais inválidas', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'senha_incorreta'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
      console.log(response.body, 'response')
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'INVALID_CREDENTIALS');
      expect(response.body).to.have.property('message').that.includes('Email ou senha inválidos');
      expect(response.body).to.have.property('remainingAttempts', 2);
    });

    it('deve retornar erro 401 com email inexistente', async () => {
      const loginData = {
        email: 'usuario_inexistente@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'INVALID_CREDENTIALS');
      expect(response.body).to.have.property('message', 'Email ou senha inválidos');
    });

    it('deve decrementar tentativas restantes a cada tentativa inválida', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'senha_incorreta'
      };

      // Resetar usuário antes do teste
      let testUser = User.findByEmail('user@example.com');
      if (testUser) User.resetLoginAttempts(testUser);

      // Primeira tentativa
      let response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
      expect(response.body.remainingAttempts).to.equal(2);

      // Segunda tentativa
      response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
      expect(response.body.remainingAttempts).to.equal(1);

      // Terceira tentativa - deve bloquear
      response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(423);
      expect(response.body).to.have.property('error', 'ACCOUNT_LOCKED');
    });
  });

  describe('3. Bloquear Senha Após 3 Tentativas', () => {
    beforeEach(() => {
      // Resetar usuário antes de cada teste de bloqueio
      const testUser = User.findByEmail('user@example.com');
      if (testUser) User.resetLoginAttempts(testUser);
    });

    it('deve bloquear a conta após 3 tentativas inválidas', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'senha_incorreta'
      };

      // Primeira tentativa
      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      // Segunda tentativa
      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      // Terceira tentativa - deve bloquear
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(423);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'ACCOUNT_LOCKED');
      expect(response.body).to.have.property('message').that.includes('Conta bloqueada por 15 minutos');
      expect(response.body).to.have.property('remainingTime').that.is.a('number');
    });

    it('deve manter a conta bloqueada mesmo com credenciais corretas', async () => {
      // Resetar usuário antes do teste
      const testUser = User.findByEmail('user@example.com');
      if (testUser) User.resetLoginAttempts(testUser);

      const wrongData = {
        email: 'user@example.com',
        password: 'senha_incorreta'
      };

      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(wrongData)
          .expect(i < 2 ? 401 : 423);
      }

      // Tentar login com credenciais corretas
      const correctData = {
        email: 'user@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(correctData)
        .expect(423);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'ACCOUNT_LOCKED');
      expect(response.body).to.have.property('message').that.includes('Conta bloqueada');
    });

    it('deve permitir login após o período de bloqueio', async () => {
      // Resetar usuário antes do teste
      const testUser = User.findByEmail('user@example.com');
      if (testUser) {
        testUser.lockedUntil = new Date(Date.now() - 1000); // 1 segundo atrás
        User.resetLoginAttempts(testUser);
      }

      const loginData = {
        email: 'user@example.com',
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Login realizado com sucesso');
    });
  });

  describe('4. Lembrar Senha', () => {
    it('deve enviar email de recuperação para usuário existente', async () => {
      const rememberData = {
        email: 'user@example.com'
      };

      const response = await request(app)
        .post('/api/auth/remember-password')
        .send(rememberData)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').that.includes('Email de recuperação enviado');
      expect(response.body).to.have.property('user').that.is.an('object');
      expect(response.body.user).to.have.property('email', 'user@example.com');
    });

    it('deve retornar erro 400 quando email não é fornecido', async () => {
      const response = await request(app)
        .post('/api/auth/remember-password')
        .send({})
        .expect(400);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'VALIDATION_ERROR');
      expect(response.body).to.have.property('message', 'Email é obrigatório');
    });

    it('deve retornar erro 404 para usuário inexistente', async () => {
      const rememberData = {
        email: 'usuario_inexistente@example.com'
      };

      const response = await request(app)
        .post('/api/auth/remember-password')
        .send(rememberData)
        .expect(404);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'USER_NOT_FOUND');
      expect(response.body).to.have.property('message', 'Usuário não encontrado com este email');
    });
  });

  describe('Verificação de Token', () => {
    it('deve verificar token válido', async () => {
      // Resetar usuário antes do teste
      const testUser = User.findByEmail('user@example.com');
      if (testUser) User.resetLoginAttempts(testUser);
      testUser.lockedUntil = null;

      // Primeiro fazer login para obter token
      const loginData = {
        email: 'user@example.com',
        password: 'password'
      };

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      const token = loginResponse.body.token;

      // Verificar token
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message', 'Token válido');
      expect(response.body).to.have.property('user').that.is.an('object');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .expect(401);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'NO_TOKEN');
      expect(response.body).to.have.property('message', 'Token não fornecido');
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('error', 'INVALID_TOKEN');
      expect(response.body).to.have.property('message', 'Token inválido ou expirado');
    });
  });

  describe('Endpoints Adicionais', () => {
    it('deve retornar status de saúde da API', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).to.have.property('status', 'OK');
      expect(response.body).to.have.property('message', 'API REST Login is running');
      expect(response.body).to.have.property('timestamp');
    });

    it('deve retornar 404 para rotas inexistentes', async () => {
      const response = await request(app)
        .get('/api/rota-inexistente')
        .expect(404);

      expect(response.body).to.have.property('error', 'Route not found');
    });
  });
}); 