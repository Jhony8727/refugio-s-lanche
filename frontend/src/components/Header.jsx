import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="bg-white shadow-lg relative z-40 border-b-4 border-orange-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end items-center">
            <Link to="/admin/login">
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300"
              >
                <FaUserShield size={22} />
              </motion.div>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
