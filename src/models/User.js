const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dados em memória (simulando banco de dados)
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'password'
    name: 'Usuário Teste',
    loginAttempts: 0,
    lockedUntil: null,
    createdAt: new Date()
  }
];

// Configurações
const JWT_SECRET = 'your-secret-key-change-in-production';
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutos em millisegundos

class User {
  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    return users.find(user => user.id === id);
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: (users.length + 1).toString(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      loginAttempts: 0,
      lockedUntil: null,
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static isAccountLocked(user) {
    if (!user.lockedUntil) return false;
    return new Date() < user.lockedUntil;
  }

  static incrementLoginAttempts(user) {
    user.loginAttempts += 1;
    
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_DURATION);
    }
    
    return user;
  }

  static resetLoginAttempts(user) {
    user.loginAttempts = 0;
    user.lockedUntil = null;
    return user;
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static getRemainingLockTime(user) {
    if (!user.lockedUntil) return 0;
    const remaining = user.lockedUntil.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  static formatLockTime(remainingTime) {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

module.exports = User; 