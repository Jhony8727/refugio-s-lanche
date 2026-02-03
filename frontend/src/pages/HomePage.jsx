import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'lanches', name: 'Lanches', icon: '🍔' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'acompanhamentos', name: 'Acompanhamentos', icon: '🍟' },
    { id: 'sobremesas', name: 'Sobremesas', icon: '🍰' }
  ];

  useEffect(() => {
    console.log('🏠 HomePage montada');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('📡 Carregando produtos...');
      const data = await getAllProducts();
      console.log('✅ Produtos carregados:', data);
      setProducts(data);
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section com Banner - REORGANIZADO para dar espaço ao logo central */}
      <section className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 py-16 px-4 pt-80">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 lg:p-12 shadow-2xl">
            {/* Texto e Botões - CENTRALIZADO */}
            <div className="flex-1 text-white text-center max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
              >
                Encontre seu Refúgio Saboroso
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl mb-8 text-white/90"
              >
                Os melhores lanches da cidade, feitos com amor, ingredientes frescos e sabor delicioso!
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 flex-wrap justify-center"
              >
                <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  🍔 Cardápio Completo
                </button>
                <button className="bg-orange-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  📦 Entregas Rápidas
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Filtros de Categoria */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.icon} {cat.name}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando delícias...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Nenhum produto encontrado 😢</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
