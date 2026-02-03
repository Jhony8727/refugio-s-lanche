const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo ao Refugio\'s Lanche API',
    version: '1.0.0',
    status: 'Online'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
