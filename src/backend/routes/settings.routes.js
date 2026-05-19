const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const settingsController = require('../controllers/settings.controller');

router.get('/', authenticate, settingsController.getSettings);
router.put('/', authenticate, authorize('super_admin'), settingsController.updateSettings);
router.put('/printer-config', authenticate, authorize('super_admin'), settingsController.updatePrinterConfig);
router.put('/tax-config', authenticate, authorize('super_admin'), settingsController.updateTaxConfig);
router.get('/system-info', authenticate, settingsController.getSystemInfo);

module.exports = router;
