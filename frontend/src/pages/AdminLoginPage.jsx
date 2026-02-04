import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaLock, FaEnvelope, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { login } from '../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);
      
      toast.success(`Bem-vindo, ${response.admin.name}! 🎉`);
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block -mb-4"
            >
              <img 
                src="/logo.png" 
                alt="Refugio's Lanche" 
                className="h-72 w-auto mx-auto"
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Admin</h1>
            <p className="text-gray-600">Acesse o painel administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="admin@refugio.com.br"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaLock className="inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-gray-600 font-semibold mb-2">Credenciais de teste:</p>
              <p className="text-gray-700">Email: <code className="bg-gray-200 px-2 py-1 rounded">admin@refugio.com.br</code></p>
              <p className="text-gray-700">Senha: <code className="bg-gray-200 px-2 py-1 rounded">admin123456</code></p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-primary-dark transition"
            >
              ← Voltar para o site
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
