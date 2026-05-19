const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const suppliersController = require('../controllers/suppliers.controller');

router.get('/', authenticate, suppliersController.getAllSuppliers);
router.get('/:id', authenticate, suppliersController.getSupplierById);
router.get('/:id/orders', authenticate, suppliersController.getSupplierOrders);
router.post('/', authenticate, authorize('super_admin', 'manager'), suppliersController.createSupplier);
router.put('/:id', authenticate, authorize('super_admin', 'manager'), suppliersController.updateSupplier);
router.delete('/:id', authenticate, authorize('super_admin'), suppliersController.deleteSupplier);
router.post('/orders/create', authenticate, authorize('super_admin', 'manager'), suppliersController.createOrder);
router.put('/orders/:id/status', authenticate, authorize('super_admin', 'manager'), suppliersController.updateOrderStatus);

module.exports = router;
