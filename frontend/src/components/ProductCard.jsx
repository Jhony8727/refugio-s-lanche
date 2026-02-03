import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem(product));
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <motion.div
      className="card-hover p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="aspect-w-16 aspect-h-12 mb-4 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Produto';
          }}
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold gradient-text">
          R$ {product.price.toFixed(2)}
        </span>
        
        <motion.button
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Adicionar
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
