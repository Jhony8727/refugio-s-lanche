# 🍔 Refugio's Lanche - Sistema Completo

Sistema de pedidos online para lanchonete com painel administrativo.

## 🚀 Iniciar Sistema

Execute o script de inicialização:

```powershell
.\INICIAR.ps1
```

Ou inicie manualmente:

### Backend
```powershell
cd backend
npm start
```

### Frontend
```powershell
cd frontend
npm run dev
```

## 🌐 Acessos

- **Site:** http://localhost:5173
- **API Backend:** http://localhost:5000
- **Painel Admin:** http://localhost:5173/admin/login

### Credenciais Admin
- **Email:** admin@refugio.com.br
- **Senha:** admin123456

## 📦 Funcionalidades

### Cliente
- ✅ Catálogo de produtos com filtros por categoria
- ✅ Carrinho de compras com controle de quantidade
- ✅ Checkout completo com dados de entrega
- ✅ Pagamento via PIX, Cartão ou Dinheiro
- ✅ Confirmação de pedido com QR Code

### Administrador
- ✅ Dashboard com estatísticas de vendas
- ✅ Gestão de pedidos em tempo real
- ✅ Atualização de status dos pedidos
- ✅ Visualização de receitas e métricas

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- QR Code Generation

### Frontend
- React 18
- Redux Toolkit
- Tailwind CSS
- Vite
- Framer Motion

## 📁 Estrutura

```
refugio-lanche/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── INICIAR.ps1
```

## 🔧 Comandos Úteis

### Popular Banco de Dados
```powershell
cd backend
npm run seed
```

### Build Frontend
```powershell
cd frontend
npm run build
```

### Preview Build
```powershell
cd frontend
npm run preview
```

## 📝 Notas

- MongoDB Atlas configurado e funcionando
- 9 produtos pré-cadastrados
- Imagens de produtos incluídas
- Sistema pronto para produção

---

**Desenvolvido para Refugio's Lanche** | Janeiro 2025
