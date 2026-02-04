import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Importar rotas
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

// Função principal para iniciar o servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados PRIMEIRO
    await connectDB();
    
    const app = express();

    // Segurança - Helmet
    app.use(helmet());

    // CORS
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }));

    // Body parser
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // limite de 100 requisições por IP
      message: 'Muitas requisições deste IP, tente novamente mais tarde.'
    });

    app.use('/api/', limiter);

    // Log de requisições em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
      });
    }

    // Rota de teste
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '🍔 Refugio\'s Lanche API',
        version: '1.0.0',
        status: 'online'
      });
    });

    // Rotas da API
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/auth', authRoutes);

    // Rota 404
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
      });
    });

    // Middleware de erro (deve ser o último)
    app.use(errorHandler);

    // Iniciar servidor
    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('🍔 REFUGIO\'S LANCHE - BACKEND');
      console.log('========================================');
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
      console.log('========================================');
      console.log('');
    });

    // Tratamento de erros não capturados
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Encerrando...');
      console.error(err);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM recebido. Encerrando graciosamente...');
      server.close(() => {
        console.log('💥 Processo terminado!');
      });
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();

export default startServer;
