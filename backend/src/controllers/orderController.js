import Order from '../models/Order.js';
import Product from '../models/Product.js';
import QRCode from 'qrcode';

// @desc    Criar novo pedido
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes } = req.body;
    
    // Validar itens do pedido
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pedido deve ter pelo menos um item'
      });
    }
    
    // Calcular total e validar produtos
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto ${item.product} não encontrado`
        });
      }
      
      if (!product.available) {
        return res.status(400).json({
          success: false,
          message: `Produto ${product.name} não está disponível`
        });
      }
      
      const subtotal = product.price * item.quantity;
      total += subtotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });
    }
    
    // Adicionar taxa de entrega e determinar tipo de entrega
    const hasAddress = customer.address?.street;
    const deliveryType = hasAddress ? 'delivery' : 'pickup';
    const deliveryFee = hasAddress ? 5.00 : 0.00;
    total += deliveryFee;
    
    // Gerar número do pedido
    const orderCount = await Order.countDocuments();
    const orderNumber = `PED${String(orderCount + 1).padStart(6, '0')}`;
    
    // Calcular tempo estimado de entrega
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45);
    
    // Criar pedido
    const order = await Order.create({
      orderNumber,
      customer,
      items: orderItems,
      total,
      deliveryFee,
      deliveryType,
      paymentMethod,
      notes,
      estimatedDeliveryTime,
      paymentStatus: paymentMethod === 'test' ? 'paid' : 'pending'
    });
    
    // Gerar QR Code
    const qrCodeData = `${process.env.FRONTEND_URL}/pedido/${order.orderNumber}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    
    order.qrCode = qrCodeImage;
    await order.save();
    
    // Popular informações dos produtos
    await order.populate('items.product');
    
    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: order
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido',
      error: error.message
    });
  }
};

// @desc    Obter todos os pedidos
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 50 } = req.query;
    
    let query = {};
    
    if (status) {
      query.orderStatus = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos',
      error: error.message
    });
  }
};

// @desc    Obter pedido por número
// @route   GET /api/orders/:orderNumber
// @access  Public
export const getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido',
      error: error.message
    });
  }
};

// @desc    Atualizar status do pedido
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    
    // Adicionar ao histórico de status
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: status,
      updatedAt: new Date(),
      updatedBy: 'Admin',
      notificationSent: false
    });
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    // Preparar mensagem de notificação
    const statusMessages = {
      pending: 'Seu pedido foi recebido e está aguardando confirmação.',
      confirmed: 'Seu pedido foi confirmado e em breve começaremos a preparar!',
      preparing: 'Estamos preparando seu pedido com todo carinho!',
      ready: 'Seu pedido está pronto! Em breve sairá para entrega.',
      delivering: 'Seu pedido saiu para entrega! Chegando em breve.',
      delivered: 'Seu pedido foi entregue! Bom apetite! 🍔'
    };
    
    const message = `🔔 Atualização do Pedido ${order.orderNumber}\n\n${statusMessages[status]}`;
    
    // Log da notificação (substitua por integração real)
    console.log(`📧 Notificação para ${order.customer.phone}: ${message}`);
    
    // TODO: Integrar com serviço de mensagens
    // await sendWhatsAppNotification(order.customer.phone, message);
    // await sendSMSNotification(order.customer.phone, message);
    // await sendEmailNotification(order.customer.email, message);
    
    res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso',
      data: order,
      notification: message
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status',
      error: error.message
    });
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/orders/:id/cancel
// @access  Public
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Pedido não pode ser cancelado'
      });
    }
    
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Pedido cancelado com sucesso',
      data: order
    });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar pedido',
      error: error.message
    });
  }
};

// @desc    Obter estatísticas de vendas
// @route   GET /api/orders/stats/sales
// @access  Private/Admin
export const getSalesStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Pedidos de hoje
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      orderStatus: { $ne: 'cancelled' }
    });
    
    // Pedidos do mês
    const monthOrders = await Order.find({
      createdAt: { $gte: thisMonth },
      orderStatus: { $ne: 'cancelled' }
    });
    
    // Total de vendas
    const totalOrders = await Order.countDocuments({ orderStatus: { $ne: 'cancelled' } });
    
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Pedidos por status
    const ordersByStatus = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        today: {
          orders: todayOrders.length,
          revenue: todayRevenue
        },
        month: {
          orders: monthOrders.length,
          revenue: monthRevenue
        },
        total: {
          orders: totalOrders
        },
        byStatus: ordersByStatus
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
};
