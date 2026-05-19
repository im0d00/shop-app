const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const inventoryController = require('../controllers/inventory.controller');

router.get('/', authenticate, inventoryController.getInventory);
router.get('/low-stock', authenticate, inventoryController.getLowStockProducts);
router.put('/:id/update-stock', authenticate, authorize('super_admin', 'manager'), inventoryController.updateStock);
router.get('/history', authenticate, inventoryController.getInventoryHistory);
router.post('/bulk-adjust', authenticate, authorize('super_admin', 'manager'), inventoryController.bulkAdjustStock);
router.get('/analytics', authenticate, inventoryController.getInventoryAnalytics);

module.exports = router;
