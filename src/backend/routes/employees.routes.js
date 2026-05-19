const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const employeesController = require('../controllers/employees.controller');

router.get('/', authenticate, employeesController.getAllEmployees);
router.get('/:id', authenticate, employeesController.getEmployeeById);
router.get('/:id/activity-log', authenticate, employeesController.getActivityLog);
router.get('/:id/sales-report', authenticate, employeesController.getSalesReport);
router.post('/', authenticate, authorize('super_admin', 'manager'), employeesController.createEmployee);
router.put('/:id', authenticate, authorize('super_admin', 'manager'), employeesController.updateEmployee);
router.delete('/:id', authenticate, authorize('super_admin'), employeesController.deleteEmployee);
router.post('/:id/deactivate', authenticate, authorize('super_admin', 'manager'), employeesController.deactivateEmployee);

module.exports = router;
