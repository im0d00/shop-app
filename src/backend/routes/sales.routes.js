const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const salesController = require('../controllers/sales.controller');

router.get('/', authenticate, salesController.getAllSales);
router.get('/:id', authenticate, salesController.getSaleById);
router.post('/', authenticate, authorize('super_admin', 'manager', 'cashier'), salesController.createSale);
router.put('/:id', authenticate, authorize('super_admin', 'manager'), salesController.updateSale);
router.delete('/:id', authenticate, authorize('super_admin'), salesController.deleteSale);
router.post('/:id/refund', authenticate, authorize('super_admin', 'manager'), salesController.refundSale);
router.get('/:id/print-receipt', authenticate, salesController.printReceipt);
router.get('/analytics/daily', authenticate, salesController.getDailySales);
router.get('/analytics/monthly', authenticate, salesController.getMonthlySales);

module.exports = router;
