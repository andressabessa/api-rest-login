require('dotenv').config();

const express = require('express');
const path = require('path');
const loginRoutes = require('./routes/login');

const app = express();
const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRoutes);

app.listen(PORT, () => {
  console.log(`Front-end rodando em http://localhost:${PORT}`);
  console.log(`API Backend URL: ${process.env.API_BASE_URL_DEV || 'http://localhost:3000'}`);
});
