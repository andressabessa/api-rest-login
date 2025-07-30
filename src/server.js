// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const app = require('./app'); // Importa a configuração do aplicativo Express (API)

// A porta para o backend (API) - diferente do frontend
const PORT = process.env.PORT || 3000; // Definido como 3000

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📚 Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/health`);
});
