# Documentação Backend - Refugio's Lanche

## 📚 Visão Geral

O backend é uma API Express.js que fornece endpoints para gerenciamento de produtos, pedidos e funcionalidades do Refugio's Lanche.

## 🔧 Tecnologias

- **Express.js** - Framework web
- **CORS** - Controle de requisições entre domínios
- **dotenv** - Variáveis de ambiente
- **qrcode** - Geração de QR codes

## 🌐 Endpoints Básicos

### GET /
Retorna informações básicas da API.

**Resposta:**
```json
{
  "message": "Bem-vindo ao Refugio's Lanche API",
  "version": "1.0.0",
  "status": "Online"
}
```

### GET /health
Verifica o status de saúde da API.

**Resposta:**
```json
{
  "status": "healthy"
}
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=
```

## 📝 Scripts

- **npm start** - Inicia o servidor de produção
- **npm run seed** - Popula o banco com dados iniciais
- **npm run dev** - Inicia com nodemon para desenvolvimento

## 🔄 Estrutura de Pastas

```
backend/
├── src/
│   ├── server.js          # Configuração do Express
│   ├── seed.js            # Script de inicialização de dados
│   ├── routes/            # Rotas da aplicação
│   ├── controllers/       # Lógica de negócio
│   ├── models/            # Modelos de dados
│   └── middleware/        # Middlewares customizados
├── package.json
├── .env.example
└── .env                   # Não faça commit deste arquivo
```

## 🚀 Próximos Passos

1. Implementar autenticação de usuários
2. Criar endpoints CRUD para produtos
3. Implementar sistema de pedidos
4. Integrar geração de QR codes
5. Configurar banco de dados

## 📌 Notas Importantes

- O servidor roda por padrão na porta 5000
- CORS está habilitado para comunicação com o frontend
- Use `nodemon` em desenvolvimento para recarregar automaticamente
