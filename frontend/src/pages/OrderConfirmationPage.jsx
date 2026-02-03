import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import QRCode from 'qrcode.react';
import Header from '../components/Header';
import { getOrderByNumber } from '../services/orderService';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      const data = await getOrderByNumber(orderNumber);
      setOrder(data);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Pedido não encontrado</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const statusText = {
    pending: 'Aguardando confirmação',
    confirmed: 'Pedido confirmado',
    preparing: 'Preparando pedido',
    ready: 'Pronto para entrega',
    delivering: 'Saiu para entrega',
    delivered: 'Entregue'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h1>
            <p className="text-xl text-gray-600 mb-4">Número do pedido: <span className="font-bold text-primary">{order.orderNumber}</span></p>
            
            <div className={`inline-block px-6 py-2 rounded-full font-semibold ${statusColors[order.orderStatus]}`}>
              {statusText[order.orderStatus]}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaClock className="text-primary" /> Tempo Estimado
              </h2>
              <p className="text-3xl font-bold text-primary">45 min</p>
              <p className="text-gray-600 text-sm mt-2">Seu pedido chegará em breve!</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">QR Code do Pedido</h2>
              <div className="flex justify-center">
                {order.qrCode ? (
                  <img src={order.qrCode} alt="QR Code" className="w-32 h-32" />
                ) : (
                  <QRCode value={`Pedido: ${order.orderNumber}`} size={128} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Detalhes do Pedido</h2>
            
            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-semibold">R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {(order.total - order.deliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ {order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-primary">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Endereço de Entrega
            </h2>
            <p className="text-gray-700">
              {order.customer.address.street}, {order.customer.address.number}
              {order.customer.address.complement && ` - ${order.customer.address.complement}`}
            </p>
            <p className="text-gray-700">
              {order.customer.address.neighborhood} - {order.customer.address.city}
            </p>
            
            <h2 className="text-xl font-bold mt-6 mb-2 flex items-center gap-2">
              <FaPhone className="text-primary" /> Contato
            </h2>
            <p className="text-gray-700">{order.customer.name}</p>
            <p className="text-gray-700">{order.customer.phone}</p>
          </div>

          <div className="text-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Fazer Novo Pedido
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
