import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserShield } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40 border-b-4 border-orange-500 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Espaçador esquerdo para centralizar ícones */}
            <div className="flex-1"></div>
          
            <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-gray-700 hover:text-orange-600 transition">
              <FaUserShield size={24} />
            </Link>
            
            <Link to="/carrinho" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 hover:text-orange-600 transition"
              >
                <FaShoppingCart size={28} />
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
