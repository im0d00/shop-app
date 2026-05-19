const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

router.get('/', authenticate, usersController.getAllUsers);
router.get('/:id', authenticate, usersController.getUserById);
router.post('/', authenticate, authorize('super_admin'), usersController.createUser);
router.put('/:id', authenticate, usersController.updateUser);
router.delete('/:id', authenticate, authorize('super_admin'), usersController.deleteUser);
router.post('/:id/change-role', authenticate, authorize('super_admin'), usersController.changeUserRole);

module.exports = router;
