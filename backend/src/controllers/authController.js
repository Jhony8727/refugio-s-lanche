import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Gerar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Login do admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }
    
    // Buscar admin com senha
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Verificar se está ativo
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada'
      });
    }
    
    // Atualizar último login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Gerar token
    const token = generateToken(admin._id);
    
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
};

// @desc    Registrar novo admin
// @route   POST /api/auth/register
// @access  Private/Super-Admin
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Verificar se admin já existe
    const adminExists = await Admin.findOne({ email });
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    // Criar admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });
    
    // Gerar token
    const token = generateToken(admin._id);
    
    res.status(201).json({
      success: true,
      message: 'Admin criado com sucesso',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar admin',
      error: error.message
    });
  }
};

// @desc    Obter dados do admin logado
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Erro ao buscar dados do admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados',
      error: error.message
    });
  }
};

// @desc    Atualizar senha
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin.id).select('+password');
    
    // Verificar senha atual
    const isPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }
    
    // Atualizar senha
    admin.password = newPassword;
    await admin.save();
    
    // Gerar novo token
    const token = generateToken(admin._id);
    
    res.status(200).json({
      success: true,
      message: 'Senha atualizada com sucesso',
      token
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha',
      error: error.message
    });
  }
};
