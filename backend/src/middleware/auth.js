import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado - Token não fornecido'
      });
    }
    
    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar admin
      req.admin = await Admin.findById(decoded.id);
      
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Não autorizado - Admin não encontrado'
        });
      }
      
      if (!req.admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado - Token inválido'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

// Middleware para verificar role de super-admin
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.admin.role} não tem permissão para acessar este recurso`
      });
    }
    next();
  };
};
