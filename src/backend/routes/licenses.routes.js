const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const licensesController = require('../controllers/licenses.controller');

router.get('/status', licensesController.getLicenseStatus);
router.post('/activate', licensesController.activateLicense);
router.post('/renew', authenticate, authorize('super_admin'), licensesController.renewLicense);
router.get('/info', authenticate, licensesController.getLicenseInfo);
router.post('/validate', licensesController.validateLicense);

module.exports = router;
