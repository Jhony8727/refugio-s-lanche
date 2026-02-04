import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Nome do cliente é obrigatório'],
      trim: true
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório']
    },
    address: {
      street: String,
      number: String,
      complement: String,
      neighborhood: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantidade mínima é 1']
    },
    subtotal: Number
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total não pode ser negativo']
  },
  deliveryFee: {
    type: Number,
    default: 5.00
  },
  deliveryType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine-in'],
    default: 'delivery'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'pix', 'cash', 'test'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  stripeSessionId: String,
  stripePaymentIntentId: String,
  receiptUrl: String,
  qrCode: String,
  estimatedDeliveryTime: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String,
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
    notificationSent: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Gerar número do pedido automático
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `RFL${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index para busca rápida
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
