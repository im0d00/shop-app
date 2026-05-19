const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const reportsController = require('../controllers/reports.controller');

router.get('/daily', authenticate, reportsController.getDailyReport);
router.get('/weekly', authenticate, reportsController.getWeeklyReport);
router.get('/monthly', authenticate, reportsController.getMonthlyReport);
router.get('/profit-loss', authenticate, authorize('super_admin', 'manager'), reportsController.getProfitLossReport);
router.get('/inventory-status', authenticate, reportsController.getInventoryReport);
router.get('/employee-performance', authenticate, authorize('super_admin', 'manager'), reportsController.getEmployeeReport);
router.get('/best-sellers', authenticate, reportsController.getBestSellersReport);
router.get('/dead-stock', authenticate, reportsController.getDeadStockReport);
router.post('/export-pdf', authenticate, reportsController.exportToPDF);
router.post('/export-excel', authenticate, reportsController.exportToExcel);

module.exports = router;
