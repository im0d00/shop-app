const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const customersController = require('../controllers/customers.controller');

router.get('/', authenticate, customersController.getAllCustomers);
router.get('/search/:query', authenticate, customersController.searchCustomers);
router.get('/:id', authenticate, customersController.getCustomerById);
router.get('/:id/history', authenticate, customersController.getCustomerHistory);
router.post('/', authenticate, customersController.createCustomer);
router.put('/:id', authenticate, customersController.updateCustomer);
router.post('/:id/add-loyalty-points', authenticate, customersController.addLoyaltyPoints);
router.post('/:id/redeem-loyalty', authenticate, customersController.redeemLoyalty);

module.exports = router;
