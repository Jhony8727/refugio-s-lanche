import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Admin from './models/Admin.js';
import Order from './models/Order.js';

dotenv.config();

// Produtos do cardápio
const products = [
  {
    name: 'X-Burguer',
    description: 'Hambúrguer suculento, queijo derretido, alface, tomate e molho especial no pão macio',
    price: 18.90,
    category: 'lanches',
    image: '/images/produtos/x-burguer.jpg',
    available: true,
    preparationTime: 15
  },
  {
    name: 'X-Frango',
    description: 'Peito de frango grelhado, queijo, alface, tomate e maionese caseira',
    price: 17.90,
    category: 'lanches',
    image: '/images/produtos/x-frango.jpg',
    available: true,
    preparationTime: 15
  },
  {
    name: 'X-Tudo',
    description: 'Hambúrguer, frango, bacon, ovo, queijo, presunto, salada completa e muito sabor',
    price: 24.90,
    category: 'lanches',
    image: '/images/produtos/x-tudo.jpg',
    available: true,
    preparationTime: 20
  },
  {
    name: 'Batata Frita',
    description: 'Porção generosa de batatas fritas crocantes e douradas',
    price: 12.90,
    category: 'acompanhamentos',
    image: '/images/produtos/batata-frita.jpg',
    available: true,
    preparationTime: 10
  },
  {
    name: 'Anéis de Cebola',
    description: 'Anéis de cebola empanados e fritos até ficarem crocantes',
    price: 14.90,
    category: 'acompanhamentos',
    image: '/images/produtos/anel-de-cebola.jpg',
    available: true,
    preparationTime: 10
  },
  {
    name: 'Refrigerante 2L',
    description: 'Refrigerante gelado 2 litros - Coca-Cola, Guaraná ou Fanta',
    price: 10.00,
    category: 'bebidas',
    image: '/images/produtos/refrigerante-2l.jpg',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Suco Natural',
    description: 'Suco natural de frutas frescas - 500ml',
    price: 8.00,
    category: 'bebidas',
    image: '/images/produtos/suco-natural.jpg',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Sorvete',
    description: 'Sorvete cremoso de diversos sabores',
    price: 7.50,
    category: 'sobremesas',
    image: '/images/produtos/sorvete.jpg',
    available: true,
    preparationTime: 5
  },
  {
    name: 'Pudim de Chocolate',
    description: 'Pudim de chocolate caseiro com calda',
    price: 9.90,
    category: 'sobremesas',
    image: '/images/produtos/pudim-de-chocolate.jpg',
    available: true,
    preparationTime: 5
  }
];

// Admin padrão
const adminData = {
  name: 'Administrador',
  email: 'admin@refugio.com.br',
  password: 'admin123456',
  role: 'super-admin',
  isActive: true
};

const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Dados antigos removidos');

    // Inserir produtos
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} produtos inseridos`);

    // Criar admin
    const admin = await Admin.create(adminData);
    console.log('✅ Admin criado:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: admin123456`);

    console.log('');
    console.log('========================================');
    console.log('🎉 SEED CONCLUÍDO COM SUCESSO!');
    console.log('========================================');
    console.log('');
    console.log('📦 Produtos inseridos:');
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - R$ ${product.price.toFixed(2)}`);
    });
    console.log('');
    console.log('👤 Admin criado:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Senha: admin123456`);
    console.log('');
    console.log('========================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    process.exit(1);
  }
};

seedDatabase();
