const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Rota de login
router.post('/login', AuthController.login);

// Rota para lembrar senha
router.post('/remember-password', AuthController.rememberPassword);

// Rota para verificar token
router.get('/verify-token', AuthController.verifyToken);

module.exports = router; 