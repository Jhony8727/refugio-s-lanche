# 🚀 GUIA RÁPIDO - Refugio's Lanche

## ⚡ Iniciar Sistema

### Opção 1: Script Automático (Recomendado)
```powershell
.\INICIAR.ps1
```

### Opção 2: Manual
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌐 URLs de Acesso

- **Site Principal:** http://localhost:5173
- **Painel Admin:** http://localhost:5173/admin/login
- **API Backend:** http://localhost:5000

## 🔑 Credenciais

**Administrador**
- Email: `admin@refugio.com.br`
- Senha: `admin123456`

## 📱 Funcionalidades do Cliente

1. **Navegar Produtos**
   - Visualize todos os produtos
   - Filtre por categoria (Lanches, Bebidas, Acompanhamentos, Sobremesas)

2. **Adicionar ao Carrinho**
   - Clique em "Adicionar" no produto desejado
   - Veja o contador no ícone do carrinho

3. **Finalizar Pedido**
   - Acesse o carrinho (ícone no topo)
   - Ajuste quantidades
   - Clique em "Finalizar Pedido"
   - Preencha dados de entrega
   - Escolha forma de pagamento (PIX, Cartão ou Dinheiro)
   - Confirme o pedido

4. **Acompanhar Pedido**
   - Após confirmação, você verá um QR Code
   - Salve o número do pedido para consultas

## 🔐 Funcionalidades do Admin

1. **Fazer Login**
   - Acesse `/admin/login`
   - Use as credenciais acima

2. **Dashboard**
   - Visualize estatísticas de vendas
   - Veja pedidos do dia, mês e total
   - Acompanhe receitas

3. **Gerenciar Pedidos**
   - Lista de pedidos recentes
   - Atualize status (Pendente → Preparando → Pronto → Entregue)
   - Cancele pedidos se necessário

## 🛠️ Comandos Úteis

### Resetar Banco de Dados
```powershell
cd backend
npm run seed
```

### Limpar e Reiniciar
```powershell
# Matar processos Node
taskkill /F /IM node.exe

# Reiniciar
.\INICIAR.ps1
```

### Build de Produção
```powershell
cd frontend
npm run build
npm run preview
```

## 🐛 Solução de Problemas

### Site não abre
```powershell
# Verificar se servidores estão rodando
netstat -ano | findstr "5000 5173"

# Se não aparecer nada, reiniciar
.\INICIAR.ps1
```

### Erro de dependências
```powershell
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Banco de dados vazio
```powershell
cd backend
npm run seed
```

## 📦 Produtos Cadastrados

1. **Lanches**
   - X-Burguer (R$ 18,90)
   - X-Frango (R$ 17,90)
   - X-Tudo (R$ 24,90)

2. **Acompanhamentos**
   - Batata Frita (R$ 12,90)
   - Anéis de Cebola (R$ 14,90)

3. **Bebidas**
   - Refrigerante 2L (R$ 10,00)
   - Suco Natural (R$ 8,00)

4. **Sobremesas**
   - Sorvete (R$ 7,50)
   - Pudim de Chocolate (R$ 9,90)

## 🎨 Personalização

### Mudar Cores
Edite: `frontend/tailwind.config.js`

### Adicionar Produto
Edite: `backend/src/seed.js` e execute `npm run seed`

### Modificar Taxa de Entrega
Edite: `frontend/src/pages/CartPage.jsx` (linha do deliveryFee)

---

**Sistema 100% Funcional** ✅

Desenvolvido em Janeiro 2025
