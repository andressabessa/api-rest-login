const User = require('../models/User');

class AuthController {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Realizar login do usuário
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Credenciais inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       423:
   *         description: Conta bloqueada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação dos dados de entrada
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário pelo email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos'
        });
      }

      // Verificar se a conta está bloqueada
      if (User.isAccountLocked(user)) {
        const remainingTime = User.getRemainingLockTime(user);
        const formattedTime = User.formatLockTime(remainingTime);
        
        return res.status(423).json({
          success: false,
          error: 'ACCOUNT_LOCKED',
          message: `Conta bloqueada. Tente novamente em ${formattedTime}`,
          remainingTime
        });
      }

      // Validar senha
      const isValidPassword = await User.validatePassword(user, password);
      if (!isValidPassword) {
        // Incrementar tentativas de login
        User.incrementLoginAttempts(user);

        // Se atingiu o limite, bloquear e retornar 423
        if (user.loginAttempts >= 3) {
          const remainingTime = User.getRemainingLockTime(user);
          const formattedTime = User.formatLockTime(remainingTime);
          return res.status(423).json({
            success: false,
            error: 'ACCOUNT_LOCKED',
            message: `Conta bloqueada por 15 minutos devido a múltiplas tentativas. Tente novamente em ${formattedTime}`,
            remainingTime
          });
        }

        // Caso contrário, retornar 401 e tentativas restantes
        const remainingAttempts = Math.max(0, 3 - user.loginAttempts);
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: `Email ou senha inválidos. Tentativas restantes: ${remainingAttempts}`,
          remainingAttempts
        });
      }

      // Login bem-sucedido - resetar tentativas
      User.resetLoginAttempts(user);
      
      // Gerar token JWT
      const token = User.generateToken(user);
      
      // Retornar resposta de sucesso
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/auth/remember-password:
   *   post:
   *     summary: Solicitar lembrança de senha
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RememberPasswordRequest'
   *     responses:
   *       200:
   *         description: Email de recuperação enviado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Email inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Usuário não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async rememberPassword(req, res) {
    try {
      const { email } = req.body;

      // Validação do email
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Email é obrigatório'
        });
      }

      // Buscar usuário pelo email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado com este email'
        });
      }

      // Em um cenário real, aqui seria enviado um email com link de recuperação
      // Para fins de demonstração, retornamos uma mensagem de sucesso
      return res.status(200).json({
        success: true,
        message: `Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/auth/verify-token:
   *   get:
   *     summary: Verificar se o token é válido
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Token válido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   type: object
   *       401:
   *         description: Token inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'NO_TOKEN',
          message: 'Token não fornecido'
        });
      }

      const token = authHeader.substring(7);
      const decoded = User.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Token inválido ou expirado'
        });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se a conta está bloqueada
      if (User.isAccountLocked(user)) {
        const remainingTime = User.getRemainingLockTime(user);
        const formattedTime = User.formatLockTime(remainingTime);
        return res.status(401).json({
          success: false,
          error: 'ACCOUNT_LOCKED',
          message: `Conta bloqueada. Tente novamente em ${formattedTime}`,
          remainingTime
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Token válido',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AuthController;