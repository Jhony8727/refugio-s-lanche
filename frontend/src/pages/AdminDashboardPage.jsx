import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaShoppingBag, FaDollarSign, FaClock, FaCheck, FaBox, FaClipboardList, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { getAllOrders, getSalesStats, updateOrderStatus } from '../services/orderService';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { isAuthenticated, logout } from '../services/authService';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'lanches',
    image: '',
    available: true,
    ingredients: ''
  });
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadData();
    
    // Verificar novos pedidos a cada 30 segundos
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, statsData, productsData] = await Promise.all([
        getAllOrders(),
        getSalesStats(),
        getAllProducts()
      ]);
      
      // Verificar novos pedidos pagos
      const newPaidOrders = ordersData.filter(order => 
        order.paymentStatus === 'paid' && 
        order.status === 'pending'
      );
      
      const currentOrderCount = newPaidOrders.length;
      
      // Se houver novos pedidos desde a última verificação
      if (lastOrderCount > 0 && currentOrderCount > lastOrderCount) {
        const newOrdersAdded = currentOrderCount - lastOrderCount;
        toast.success(`🔔 ${newOrdersAdded} novo(s) pedido(s) pago(s) recebido(s)!`, {
          autoClose: 5000,
          position: 'top-right'
        });
        
        // Tocar som de notificação
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.log('Erro ao tocar som:', err));
        }
      }
      
      setLastOrderCount(currentOrderCount);
      setNewOrdersCount(currentOrderCount);
      setOrders(ordersData);
      setStats(statsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Status atualizado!');
      loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        available: product.available,
        ingredients: product.ingredients?.join(', ') || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: 'lanches',
        image: '',
        available: true,
        ingredients: ''
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'lanches',
      image: '',
      available: true,
      ingredients: ''
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(i => i)
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct(productData);
        toast.success('Produto criado com sucesso!');
      }
      closeProductModal();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      await deleteProduct(productId);
      toast.success('Produto deletado com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao deletar produto');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem');
        return;
      }
      
      // Verificar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result });
        toast.success('Imagem carregada com sucesso!');
      };
      reader.readAsDataURL(file);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-500 text-white'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Elemento de áudio para notificação */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwPUKnk77RgGwU7k9nxy3krBSl+zPLaizsKGGS56+mhUBELTKXh8bllHAU2jdXty3YpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNryy3grBSh+zPDaizsKF2O48OmgUREKSqPg8bllHAU2jdXuy3YpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGgU8lNrxyHYpBSh6yO/eizwLGWe88OihTxAMTqjk8LNfGg==" />
      
      {/* Logo no canto esquerdo como botão para página inicial */}
      <Link to="/" className="fixed top-6 left-6 z-50 group">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg"
        >
          <img 
            src="/logo.png" 
            alt="Refúgio's Lanche" 
            className="h-20 w-auto"
          />
        </motion.div>
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Voltar ao Início
        </span>
      </Link>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold gradient-text">Painel Administrativo</h1>
            
            {/* Indicador de novos pedidos */}
            {newOrdersCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <FaBell className="text-3xl text-orange-500 animate-bounce" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {newOrdersCount}
                </span>
              </motion.div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaClipboardList /> Pedidos
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBox /> Produtos
          </button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <FaShoppingBag className="text-3xl text-primary mb-2" />
              <p className="text-gray-600">Pedidos Hoje</p>
              <p className="text-3xl font-bold">{stats.today.orders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <FaDollarSign className="text-3xl text-green-500 mb-2" />
              <p className="text-gray-600">Faturamento Hoje</p>
              <p className="text-3xl font-bold">R$ {stats.today.revenue.toFixed(2)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <FaClock className="text-3xl text-orange-500 mb-2" />
              <p className="text-gray-600">Pedidos Mês</p>
              <p className="text-3xl font-bold">{stats.month.orders}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <FaCheck className="text-3xl text-blue-500 mb-2" />
              <p className="text-gray-600">Total Pedidos</p>
              <p className="text-3xl font-bold">{stats.total.orders}</p>
            </motion.div>
          </div>
        )}

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Pedidos Recentes</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Pedido</th>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 font-bold">{order.orderNumber}</td>
                      <td className="px-4 py-4">{order.customer.name}</td>
                      <td className="px-4 py-4 font-semibold text-primary">R$ {order.total.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aba de Produtos */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <button
                onClick={() => openProductModal()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition"
              >
                <FaPlus /> Adicionar Produto
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-2xl font-bold text-orange-600 mb-3">R$ {product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <FaTrash /> Deletar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Produto */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                  </h2>
                  <button
                    onClick={closeProductModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome do Produto</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Descrição</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Categoria</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="lanches">Lanches</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="acompanhamentos">Acompanhamentos</option>
                        <option value="sobremesas">Sobremesas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Imagem do Produto</label>
                    
                    <div className="space-y-3">
                      {/* Opção 1: Upload de arquivo */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Fazer upload da imagem:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                        />
                      </div>
                      
                      {/* Opção 2: URL da imagem */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Ou inserir URL da imagem:</label>
                        <input
                          type="text"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="/images/produtos/produto.jpg ou https://..."
                        />
                      </div>
                      
                      {/* Preview da imagem */}
                      {productForm.image && (
                        <div className="mt-2">
                          <label className="block text-xs text-gray-600 mb-1">Preview:</label>
                          <img 
                            src={productForm.image} 
                            alt="Preview" 
                            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              toast.error('Erro ao carregar preview da imagem');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Ingredientes (separados por vírgula)</label>
                    <input
                      type="text"
                      value={productForm.ingredients}
                      onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Pão, Hambúrguer, Queijo, Alface"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={productForm.available}
                      onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="text-sm font-semibold">Produto disponível</label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeProductModal}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                    >
                      <FaSave /> {editingProduct ? 'Atualizar' : 'Criar'} Produto
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
