import express from 'express';
import {
  login,
  register,
  getMe,
  updatePassword
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/login', login);

// Rotas protegidas
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

// Rotas de super-admin
router.post('/register', protect, authorizeRoles('super-admin'), register);

export default router;
