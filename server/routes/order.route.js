import { Router } from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { isAuthenticatedUser, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', isAuthenticatedUser, isAdmin, getAllOrders); // ✅ Added route for /api/orders
router.post('/create', isAuthenticatedUser, createOrder);
router.get('/admin/all', isAuthenticatedUser, isAdmin, getAllOrders);
router.put('/admin/:id/status', isAuthenticatedUser, isAdmin, updateOrderStatus);

export default router;