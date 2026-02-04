import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    console.log('🔄 Tentando conectar ao MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Configurada' : 'NÃO ENCONTRADA');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ Erro ao conectar MongoDB:`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    process.exit(1);
  }
};

// Eventos de conexão
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erro de conexão Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado do MongoDB');
});

export default connectDB;
