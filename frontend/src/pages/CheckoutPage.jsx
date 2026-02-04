import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaCreditCard, FaMoneyBillWave, FaShoppingBag, FaQrcode, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import { createOrder } from '../services/orderService';
import { clearCart } from '../store/cartSlice';

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' ou 'local'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });

  const deliveryFee = orderType === 'delivery' ? 5.00 : 0.00;
  const total = cart.total + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Seu carrinho está vazio!');
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    if (orderType === 'delivery' && !formData.street) {
      toast.error('Preencha o endereço de entrega!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: orderType === 'delivery' ? {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          } : {}
        },
        items: cart.items.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        orderType: orderType,
        paymentMethod: paymentMethod,
        notes: formData.notes
      };

      const order = await createOrder(orderData);
      
      toast.success('Pedido realizado com sucesso! 🎉');
      dispatch(clearCart());
      
      navigate(`/pedido/${order.orderNumber}`);
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error(error.response?.data?.message || 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <FaShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Carrinho Vazio</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Ver Cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all font-semibold shadow-md"
          >
            <FaArrowLeft /> Voltar
          </motion.button>
          <h1 className="text-4xl font-bold gradient-text">Finalizar Pedido</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tipo de Pedido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tipo de Pedido</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    orderType === 'delivery' 
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">🚚</div>
                  <p className="font-bold text-lg">Entrega</p>
                  <p className="text-sm text-gray-600 mt-1">Receba em casa</p>
                  {orderType === 'delivery' && (
                    <p className="text-xs text-orange-600 font-semibold mt-2">Taxa: R$ 5,00</p>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setOrderType('local')}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    orderType === 'local' 
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-4xl mb-2">🍽️</div>
                  <p className="font-bold text-lg">Retirar ou Consumir no Local</p>
                  <p className="text-sm text-gray-600 mt-1">Busque ou aproveite na loja</p>
                  {orderType === 'local' && (
                    <p className="text-xs text-green-600 font-semibold mt-2">Sem taxa de entrega</p>
                  )}
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Dados Pessoais</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </motion.div>

            {orderType === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Endereço de Entrega</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rua *</label>
                  <input
                    type="text" name="street" value={formData.street} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Nome da rua"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Número</label>
                  <input
                    type="text" name="number" value={formData.number} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Complemento</label>
                  <input
                    type="text" name="complement" value={formData.complement} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Apto, bloco"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Seu bairro"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text" name="city" value={formData.city} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Sua cidade"
                  />
                </div>
              </div>
            </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Forma de Pagamento</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button" onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-gray-300'
                  }`}
                >
                  <FaCreditCard className="text-3xl mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Cartão</p>
                </button>
                
                <button
                  type="button" onClick={() => setPaymentMethod('pix')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    paymentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-gray-300'
                  }`}
                >
                  <FaQrcode className="text-3xl mx-auto mb-2 text-primary" />
                  <p className="font-semibold">PIX</p>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Observações</h2>
              <textarea
                name="notes" value={formData.notes} onChange={handleInputChange} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Alguma observação? (Opcional)"
              />
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Tempo estimado: 45 minutos
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
