import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useEffect } from 'react';

function LogoFixed() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: isHomePage ? '200px' : '20px',
        left: isHomePage ? '50%' : '20px',
        transform: isHomePage ? 'translate(-50%, -50%)' : 'none',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'none'
      }}
    >
      <Link to="/" style={{ pointerEvents: 'auto' }}>
        <img 
          src="/logo.png" 
          alt="Refugio's Lanche"
          style={{ 
            height: isHomePage ? '650px' : '80px',
            width: 'auto',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
            display: 'block',
            transition: 'none'
          }}
        />
      </Link>
    </div>
  );
}

function App() {
  useEffect(() => {
    console.log('🍔 App montado com sucesso!');
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <LogoFixed />
        
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
