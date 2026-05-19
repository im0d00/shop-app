const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const backupsController = require('../controllers/backups.controller');

router.get('/', authenticate, authorize('super_admin'), backupsController.getAllBackups);
router.post('/create', authenticate, authorize('super_admin'), backupsController.createBackup);
router.post('/restore', authenticate, authorize('super_admin'), backupsController.restoreBackup);
router.delete('/:id', authenticate, authorize('super_admin'), backupsController.deleteBackup);
router.post('/auto-schedule', authenticate, authorize('super_admin'), backupsController.scheduleAutoBackup);

module.exports = router;
