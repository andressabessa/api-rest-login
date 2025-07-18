const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Login',
      version: '1.0.0',
      description: 'API REST simples de login com funcionalidades de autenticação',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se o login foi bem-sucedido'
            },
            message: {
              type: 'string',
              description: 'Mensagem de resposta'
            },
            token: {
              type: 'string',
              description: 'Token JWT (apenas em caso de sucesso)'
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' }
              }
            }
          }
        },
        RememberPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário para lembrar senha'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo do erro'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

module.exports = { swaggerOptions }; 