const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    error: req.query.error || null,
    API_BASE_URL: process.env.API_BASE_URL_DEV || 'http://localhost:3000'
  });
});

router.get('/home', (req, res) => {
  res.render('home');
});

router.get('/remember-password', (req, res) => {
  res.render('remember-password', { message: null, error: null });
});

module.exports = router;
