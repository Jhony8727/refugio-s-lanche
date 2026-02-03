# 🔧 Funções do Backend - Refugio's Lanche

## 📁 Estrutura do Backend

```
backend/
├── src/
│   ├── server.js           # Servidor principal
│   ├── seed.js             # Popular banco de dados
│   ├── config/
│   │   └── database.js     # Configuração MongoDB
│   ├── models/
│   │   ├── Admin.js        # Modelo de administrador
│   │   ├── Order.js        # Modelo de pedido
│   │   └── Product.js      # Modelo de produto
│   ├── controllers/
│   │   ├── authController.js     # Controle de autenticação
│   │   ├── orderController.js    # Controle de pedidos
│   │   └── productController.js  # Controle de produtos
│   ├── middleware/
│   │   ├── auth.js               # Verificação de autenticação
│   │   └── errorHandler.js       # Tratamento de erros
│   └── routes/
│       ├── authRoutes.js         # Rotas de autenticação
│       ├── orderRoutes.js        # Rotas de pedidos
│       └── productRoutes.js      # Rotas de produtos
└── package.json
```

---

## 🚀 Iniciar o Backend

### Comando Único
```bash
cd backend
node src/server.js
```

### Com Nodemon (Reinicia automaticamente)
```bash
npm run dev
```

**Porta:** `5000`
**URL:** `http://localhost:5000`

---

## 🗄️ Configuração do Banco de Dados

### 📍 Arquivo: `config/database.js`

**Função:** Conecta ao MongoDB Atlas

```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB');
    process.exit(1);
  }
}
```

**Variáveis de Ambiente (.env):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=sua-chave-secreta
PORT=5000
```

---

## 📦 Modelos (Models)

### 1️⃣ Admin.js - Administrador

**Campos:**
- `name` (String, obrigatório) - Nome do admin
- `email` (String, único, obrigatório) - Email de login
- `password` (String, obrigatório) - Senha criptografada
- `createdAt` (Date, auto) - Data de criação

**Métodos:**
```javascript
// Comparar senha
admin.comparePassword(senhaDigitada);

// Criptografar senha antes de salvar
pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
```

**Admin Padrão:**
- Email: `admin@refugio.com.br`
- Senha: `admin123456`

---

### 2️⃣ Product.js - Produto

**Campos:**
- `name` (String, obrigatório) - Nome do produto
- `description` (String, obrigatório) - Descrição
- `price` (Number, obrigatório) - Preço
- `category` (String) - Categoria (lanches, bebidas, etc)
- `image` (String, obrigatório) - URL da imagem
- `available` (Boolean, default: true) - Disponível?
- `ingredients` (Array) - Lista de ingredientes
- `createdAt` (Date, auto) - Data de criação

**Categorias Disponíveis:**
- `lanches` 🍔
- `bebidas` 🥤
- `acompanhamentos` 🍟
- `sobremesas` 🍰

---

### 3️⃣ Order.js - Pedido

**Campos:**
- `orderNumber` (String, único, auto) - Número do pedido (#XXXXX)
- `items` (Array) - Lista de produtos
  - `product` (ObjectId) - Referência ao produto
  - `quantity` (Number) - Quantidade
  - `price` (Number) - Preço unitário
- `customer` (Object) - Dados do cliente
  - `name` (String) - Nome
  - `phone` (String) - Telefone
  - `address` (String) - Endereço
- `paymentMethod` (String) - Método de pagamento
- `total` (Number) - Total do pedido
- `status` (String) - Status do pedido
- `createdAt` (Date, auto) - Data do pedido

**Status Possíveis:**
- `pending` - Pendente
- `confirmed` - Confirmado
- `preparing` - Preparando
- `ready` - Pronto
- `delivered` - Entregue
- `cancelled` - Cancelado

**Métodos de Pagamento:**
- `pix`
- `card`
- `money`

---

## 🎯 Controllers (Controladores)

### 1️⃣ authController.js - Autenticação

#### `login(req, res)`
**Rota:** `POST /api/auth/login`

**Função:** Autentica administrador

**Body:**
```json
{
  "email": "admin@refugio.com.br",
  "password": "admin123456"
}
```

**Resposta Sucesso:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "name": "Admin",
    "email": "admin@refugio.com.br"
  }
}
```

**Processo:**
1. Busca admin por email
2. Compara senha com bcrypt
3. Gera token JWT
4. Retorna token e dados do admin

---

#### `register(req, res)`
**Rota:** `POST /api/auth/register`

**Função:** Registra novo administrador

**Body:**
```json
{
  "name": "Novo Admin",
  "email": "novo@refugio.com.br",
  "password": "senha123"
}
```

**Processo:**
1. Verifica se email já existe
2. Criptografa senha
3. Cria novo admin
4. Retorna sucesso

---

### 2️⃣ productController.js - Produtos

#### `getAllProducts(req, res)`
**Rota:** `GET /api/products`

**Função:** Lista todos os produtos disponíveis

**Resposta:**
```json
[
  {
    "_id": "...",
    "name": "X-Bacon",
    "description": "Hambúrguer com bacon...",
    "price": 25.90,
    "category": "lanches",
    "image": "/images/produtos/x-bacon.jpg",
    "available": true,
    "ingredients": ["Pão", "Hambúrguer", "Bacon", "Queijo"]
  }
]
```

---

#### `getProductById(req, res)`
**Rota:** `GET /api/products/:id`

**Função:** Busca produto específico por ID

**Resposta:**
```json
{
  "_id": "65a1b2c3d4e5f6...",
  "name": "X-Bacon",
  "description": "...",
  "price": 25.90
}
```

---

#### `createProduct(req, res)` 🔒
**Rota:** `POST /api/products`

**Autenticação:** Requer token de admin

**Função:** Cria novo produto

**Body:**
```json
{
  "name": "X-Salada",
  "description": "Hambúrguer com salada",
  "price": 18.90,
  "category": "lanches",
  "image": "/images/produtos/x-salada.jpg",
  "ingredients": ["Pão", "Hambúrguer", "Alface", "Tomate"]
}
```

---

#### `updateProduct(req, res)` 🔒
**Rota:** `PUT /api/products/:id`

**Autenticação:** Requer token de admin

**Função:** Atualiza produto existente

**Body:** (Campos a atualizar)
```json
{
  "price": 22.90,
  "available": false
}
```

---

#### `deleteProduct(req, res)` 🔒
**Rota:** `DELETE /api/products/:id`

**Autenticação:** Requer token de admin

**Função:** Deleta produto

---

### 3️⃣ orderController.js - Pedidos

#### `createOrder(req, res)`
**Rota:** `POST /api/orders`

**Função:** Cria novo pedido

**Body:**
```json
{
  "items": [
    {
      "product": "65a1b2c3d4e5f6...",
      "quantity": 2,
      "price": 25.90
    }
  ],
  "customer": {
    "name": "João Silva",
    "phone": "(11) 98765-4321",
    "address": "Rua Exemplo, 123"
  },
  "paymentMethod": "pix",
  "total": 51.80
}
```

**Resposta:**
```json
{
  "order": {
    "orderNumber": "#12345",
    "items": [...],
    "customer": {...},
    "total": 51.80,
    "status": "pending"
  }
}
```

**Processo:**
1. Gera número do pedido único
2. Salva pedido no banco
3. Retorna dados do pedido

---

#### `getAllOrders(req, res)` 🔒
**Rota:** `GET /api/orders`

**Autenticação:** Requer token de admin

**Função:** Lista todos os pedidos (mais recentes primeiro)

**Resposta:**
```json
[
  {
    "orderNumber": "#12345",
    "customer": {
      "name": "João Silva",
      "phone": "(11) 98765-4321"
    },
    "total": 51.80,
    "status": "pending",
    "createdAt": "2026-02-03T..."
  }
]
```

---

#### `getOrderByNumber(req, res)`
**Rota:** `GET /api/orders/:orderNumber`

**Função:** Busca pedido por número

**Exemplo:** `GET /api/orders/12345`

**Resposta:**
```json
{
  "orderNumber": "#12345",
  "items": [...],
  "customer": {...},
  "total": 51.80,
  "status": "pending"
}
```

---

#### `updateOrderStatus(req, res)` 🔒
**Rota:** `PATCH /api/orders/:id/status`

**Autenticação:** Requer token de admin

**Função:** Atualiza status do pedido

**Body:**
```json
{
  "status": "preparing"
}
```

**Status Válidos:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `delivered`
- `cancelled`

---

## 🔐 Middleware

### 1️⃣ auth.js - Autenticação

**Função:** Verifica se requisição tem token JWT válido

**Uso:**
```javascript
router.post('/products', authenticateToken, createProduct);
```

**Processo:**
1. Extrai token do header `Authorization: Bearer TOKEN`
2. Verifica se token é válido com `jwt.verify()`
3. Adiciona dados do admin em `req.user`
4. Se inválido, retorna erro 401

---

### 2️⃣ errorHandler.js - Tratamento de Erros

**Função:** Captura e formata erros

**Resposta de Erro:**
```json
{
  "error": "Mensagem do erro"
}
```

---

## 🛣️ Rotas (Routes)

### authRoutes.js
```javascript
POST   /api/auth/login      # Login de admin
POST   /api/auth/register   # Registro de admin
```

### productRoutes.js
```javascript
GET    /api/products        # Listar produtos
GET    /api/products/:id    # Buscar produto
POST   /api/products        # Criar produto 🔒
PUT    /api/products/:id    # Atualizar produto 🔒
DELETE /api/products/:id    # Deletar produto 🔒
```

### orderRoutes.js
```javascript
POST   /api/orders                  # Criar pedido
GET    /api/orders                  # Listar pedidos 🔒
GET    /api/orders/:orderNumber     # Buscar pedido
PATCH  /api/orders/:id/status       # Atualizar status 🔒
```

**🔒 = Requer autenticação de admin**

---

## 🌱 Seed (Popular Banco)

### Arquivo: `seed.js`

**Comando:**
```bash
node src/seed.js
```

**Função:** Popula banco de dados com dados iniciais

**Cria:**
1. **Admin padrão:**
   - Email: `admin@refugio.com.br`
   - Senha: `admin123456`

2. **9 Produtos:**
   - 4 Lanches (X-Bacon, X-Salada, X-Tudo, X-Frango)
   - 2 Bebidas (Coca-Cola, Suco)
   - 2 Acompanhamentos (Batata Frita, Onion Rings)
   - 1 Sobremesa (Milk Shake)

**Processo:**
1. Limpa coleções existentes
2. Cria admin
3. Cria produtos
4. Exibe sucesso

---

## 📝 Variáveis de Ambiente (.env)

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/refugio-lanche

# Autenticação
JWT_SECRET=sua-chave-secreta-super-segura

# Servidor
PORT=5000
NODE_ENV=development
```

---

## 🧪 Testar API

### Com cURL (PowerShell)

```powershell
# Listar produtos
curl http://localhost:5000/api/products

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@refugio.com.br","password":"admin123456"}'

# Criar pedido
curl -X POST http://localhost:5000/api/orders `
  -H "Content-Type: application/json" `
  -d '{"items":[{"product":"ID","quantity":1,"price":25.90}],"customer":{"name":"João","phone":"11999999999","address":"Rua X"},"paymentMethod":"pix","total":25.90}'
```

### Com Postman ou Insomnia

1. Importe coleção de rotas
2. Configure variável `BASE_URL = http://localhost:5000`
3. Faça login para obter token
4. Use token nas rotas protegidas (Header: `Authorization: Bearer TOKEN`)

---

## 🔧 Dependências Principais

```json
{
  "express": "4.18.2",        // Framework web
  "mongoose": "8.0.3",        // MongoDB ODM
  "bcryptjs": "2.4.3",        // Criptografia de senha
  "jsonwebtoken": "9.0.2",    // Autenticação JWT
  "cors": "2.8.5",            // Cross-Origin
  "dotenv": "16.3.1"          // Variáveis de ambiente
}
```

---

## 🐛 Debugging

### Logs Importantes
```javascript
console.log('✅ MongoDB conectado');
console.log('✅ Servidor rodando na porta 5000');
console.log('📦 Produto criado:', product);
console.log('📦 Pedido criado:', order);
```

### Erros Comuns

**Erro: "MongoDB connection failed"**
- Verifique `MONGODB_URI` no `.env`
- Verifique conexão com internet
- Verifique IP whitelist no MongoDB Atlas

**Erro: "Token inválido"**
- Verifique se token foi enviado no header
- Verifique formato: `Bearer TOKEN`
- Token pode ter expirado (24h)

**Erro: "Product not found"**
- Verifique se ID do produto está correto
- Execute `seed.js` para popular banco

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique logs do servidor
2. Teste rotas com Postman
3. Verifique se MongoDB está conectado
4. Verifique variáveis de ambiente (.env)

---

**✨ Backend desenvolvido com Node.js, Express e MongoDB!**
