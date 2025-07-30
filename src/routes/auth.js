const express = require('express');
const AuthController = require('../controllers/authController'); // Certifique-se de que o caminho esteja correto

const router = express.Router();

// Rota de login da API (retorna JSON)
router.post('/login', AuthController.login);

// Rota para lembrar senha da API (retorna JSON)
router.post('/remember-password', AuthController.rememberPassword);

// Rota para verificar token da API (retorna JSON)
router.get('/verify-token', AuthController.verifyToken);

module.exports = router;
