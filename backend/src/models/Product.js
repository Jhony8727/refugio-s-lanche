import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['lanches', 'bebidas', 'acompanhamentos', 'sobremesas']
  },
  image: {
    type: String,
    required: [true, 'Imagem é obrigatória']
  },
  available: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: [5, 'Tempo mínimo de preparo é 5 minutos']
  }
}, {
  timestamps: true
});

// Index para busca rápida
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, available: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
