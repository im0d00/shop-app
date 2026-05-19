const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const productsController = require('../controllers/products.controller');

router.get('/', authenticate, productsController.getAllProducts);
router.get('/search/:query', authenticate, productsController.searchProducts);
router.get('/:id', authenticate, productsController.getProductById);
router.post('/', authenticate, authorize('super_admin', 'manager'), productsController.createProduct);
router.put('/:id', authenticate, authorize('super_admin', 'manager'), productsController.updateProduct);
router.delete('/:id', authenticate, authorize('super_admin'), productsController.deleteProduct);
router.post('/:id/variants', authenticate, authorize('super_admin', 'manager'), productsController.addVariant);
router.post('/bulk-import', authenticate, authorize('super_admin', 'manager'), productsController.bulkImport);
router.get('/bulk-export', authenticate, productsController.bulkExport);

module.exports = router;
