# Refugio's Lanche

Plataforma de pedidos e gestão para Refugio's Lanche.

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

## 🚀 Iniciando

### Backend

```bash
cd backend
npm install
npm run seed    # Popular dados iniciais
npm start       # Iniciar servidor (porta 5000)
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # Iniciar servidor de desenvolvimento (porta 5173)
```

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── server.js      # Servidor Express
│   │   ├── seed.js        # Script de dados iniciais
│   │   └── ...
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx       # Ponto de entrada React
│   │   ├── App.jsx        # Componente principal
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

## 🔄 Scripts Disponíveis

### Backend
- `npm start` - Inicia o servidor de produção
- `npm run seed` - Popula o banco de dados com dados iniciais
- `npm run dev` - Inicia com nodemon para desenvolvimento

### Frontend
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza a build de produção

## 📝 Documentação

Veja [BACKEND_FUNCOES.md](./BACKEND_FUNCOES.md) para documentação detalhada das funcionalidades do backend.

## 📄 Licença

ISC

## 👤 Autor

Jhony
