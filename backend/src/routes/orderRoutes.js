import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
  getSalesStats
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/', createOrder);
router.get('/number/:orderNumber', getOrderByNumber);
router.put('/:id/cancel', cancelOrder);

// Rotas protegidas (admin)
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.get('/stats/sales', protect, getSalesStats);

export default router;
