const express = require('express');
const { userController } = require('../controllers/userController');
const { authenticate, authorize, requirePermission } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { 
  createUserSchema, 
  updateUserSchema, 
  assignRoleSchema, 
  updateUserStatusSchema 
} = require('../schemas/userSchemas');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get users (admin only)
router.get('/', 
  requirePermission('users.read'), 
  userController.getUsers
);

// Get user by ID
router.get('/:id', 
  requirePermission('users.read'), 
  userController.getUserById
);

// Create user (admin only)
router.post('/', 
  requirePermission('users.create'), 
  validateRequest(createUserSchema), 
  userController.createUser
);

// Update user
router.put('/:id', 
  requirePermission('users.update'), 
  validateRequest(updateUserSchema), 
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id', 
  requirePermission('users.delete'), 
  userController.deleteUser
);

// Assign role to user
router.post('/:id/assign-role', 
  requirePermission('users.manage_roles'), 
  validateRequest(assignRoleSchema), 
  userController.assignRole
);

// Remove role from user
router.delete('/:id/roles/:roleId', 
  requirePermission('users.manage_roles'), 
  userController.removeRole
);

// Update user status
router.patch('/:id/status', 
  requirePermission('users.manage_status'), 
  validateRequest(updateUserStatusSchema), 
  userController.updateUserStatus
);

module.exports = router;
