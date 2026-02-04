import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  
  const cart = useSelector((state) => state.cart);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'lanches', name: 'Lanches', icon: '🍔' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
    { id: 'acompanhamentos', name: 'Acompanhamentos', icon: '🍟' },
    { id: 'sobremesas', name: 'Sobremesas', icon: '🍰' }
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      console.log('📦 Produtos recebidos:', data);
      if (data && Array.isArray(data)) {
        setProducts(data);
        console.log('✅ Produtos definidos no estado:', data.length);
      } else {
        console.error('❌ Dados inválidos recebidos:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
      console.log('🔄 Loading finalizado');
    }
  };

  useEffect(() => {
    loadProducts();
    
    // Recarrega produtos quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProducts();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Logo Sobreposto */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-52 z-50">
          <img 
            src="/logo.png" 
            alt="Refugio's Lanche" 
            className="h-[750px] w-auto"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
          />
        </div>
      </div>
      
      {/* Hero Section Moderno */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 pt-[420px] pb-8">
        {/* Elementos decorativos flutuantes */}
        <motion.div
          className="absolute top-20 left-10 text-8xl opacity-30"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🍔
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-7xl opacity-30"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🍟
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-6xl opacity-30"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🥤
        </motion.div>
        <motion.div
          className="absolute top-60 left-1/3 text-7xl opacity-25"
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-1/4 text-6xl opacity-25"
          animate={{ y: [0, -18, 0], rotate: [0, 7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🌮
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-10 text-5xl opacity-25"
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🍰
        </motion.div>
        <motion.div
          className="absolute bottom-60 left-20 text-6xl opacity-25"
          animate={{ y: [0, -10, 0], rotate: [0, 9, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🥗
        </motion.div>
        <motion.div
          className="absolute top-32 right-1/3 text-7xl opacity-30"
          animate={{ y: [0, -25, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          🌭
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-16 text-6xl opacity-25"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut" }}
        >
          🍿
        </motion.div>
        <motion.div
          className="absolute top-48 left-1/2 text-5xl opacity-20"
          animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        >
          🥙
        </motion.div>
        <motion.div
          className="absolute bottom-48 left-1/3 text-6xl opacity-25"
          animate={{ y: [0, -12, 0], rotate: [0, -7, 0] }}
          transition={{ duration: 5.7, repeat: Infinity, ease: "easeInOut" }}
        >
          🍩
        </motion.div>
        <motion.div
          className="absolute top-2/3 right-1/4 text-7xl opacity-30"
          animate={{ y: [0, 18, 0], rotate: [0, 11, 0] }}
          transition={{ duration: 4.3, repeat: Infinity, ease: "easeInOut" }}
        >
          🧁
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-16 text-6xl opacity-25"
          animate={{ y: [0, -14, 0], rotate: [0, -9, 0] }}
          transition={{ duration: 5.9, repeat: Infinity, ease: "easeInOut" }}
        >
          🥪
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Texto de boas-vindas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 mt-4"
          >
            <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              Sabor que é um Refúgio
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Cada lanche é preparado com carinho especial para você! 🐱✨
            </p>
          </motion.div>

          {/* Cards de destaques com gradiente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="text-5xl mb-3">🚀</div>
              <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
              <p className="text-orange-50 text-sm">Seu lanche quentinho em até 30 minutos!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="text-5xl mb-3">🌟</div>
              <h3 className="text-xl font-bold mb-2">Ingredientes Frescos</h3>
              <p className="text-orange-50 text-sm">Qualidade garantida em cada mordida!</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl p-6 shadow-xl text-white"
            >
              <div className="text-5xl mb-3">💝</div>
              <h3 className="text-xl font-bold mb-2">Feito com Amor</h3>
              <p className="text-orange-50 text-sm">Cada lanche é uma experiência única!</p>
            </motion.div>
          </div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 26.7C960 32 1056 48 1152 53.3C1248 59 1344 53 1392 50.7L1440 48V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Seção de Categorias Modernas */}
      <section className="bg-white pt-8 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-center mb-14 text-gray-800"
          >
            Explore Nosso Cardápio
          </motion.h2>

          {/* Filtros de Categoria Redesenhados */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-2xl scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-lg'
                }`}
              >
                <span className="text-3xl block mb-1">{cat.icon}</span>
                <span>{cat.name}</span>
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Grid de Produtos */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block text-8xl mb-4"
              >
                🍔
              </motion.div>
              <p className="text-2xl text-gray-600 font-medium">Preparando delícias...</p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-9xl mb-6">😿</div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">Ops! Nenhum produto encontrado</h3>
              <p className="text-xl text-gray-500">Tente outra categoria deliciosa!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16 min-h-[400px]">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carrinho Flutuante Moderno e Grande */}
      <div className="fixed bottom-0 right-6 z-50">
        {/* Botão do Carrinho */}
        <motion.button
          onClick={() => setCartOpen(!cartOpen)}
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-t-3xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 px-8 py-6 flex items-center gap-4">
            <div className="relative">
              <FaShoppingBag size={32} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white text-sm w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium opacity-90">Meu Carrinho</p>
              <p className="text-xl font-bold">R$ {totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </motion.button>

        {/* Painel do Carrinho */}
        <AnimatePresence>
          {cartOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="absolute bottom-full right-0 mb-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
              style={{ width: '420px', maxHeight: '600px' }}
            >
              {/* Header do Carrinho */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Seu Pedido</h3>
                  <p className="text-sm opacity-90">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Lista de Itens */}
              {itemCount === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-8xl mb-4">🛒</div>
                  <p className="text-xl text-gray-600 font-medium">Seu carrinho está vazio</p>
                  <p className="text-sm text-gray-400 mt-2">Adicione delícias ao seu pedido!</p>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                    {cart.items.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity}x <span className="font-semibold text-orange-600">R$ {item.price.toFixed(2)}</span>
                          </p>
                        </div>
                        <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          R$ {(item.quantity * item.price).toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer com Total e Botão */}
                  <div className="border-t-2 border-orange-200 p-6 bg-gradient-to-b from-white to-orange-50">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total do Pedido</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          R$ {totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <Link to="/carrinho" onClick={() => setCartOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                      >
                        Finalizar Pedido
                        <FaArrowRight size={20} />
                      </motion.button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
