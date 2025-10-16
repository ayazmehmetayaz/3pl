import { Router } from 'express';
import { userController } from '@/controllers/userController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validateRequest';
import { createUserSchema, updateUserSchema } from '@/schemas/userSchemas';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route GET /api/v1/users
 * @desc Get all users
 * @access Private (Admin, HR Manager)
 */
router.get('/', authorize(['admin', 'hr_manager']), userController.getUsers);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get('/:id', userController.getUserById);

/**
 * @route POST /api/v1/users
 * @desc Create new user
 * @access Private (Admin, HR Manager)
 */
router.post('/', 
  authorize(['admin', 'hr_manager']), 
  validateRequest(createUserSchema), 
  userController.createUser
);

/**
 * @route PUT /api/v1/users/:id
 * @desc Update user
 * @access Private (Admin, HR Manager, Self)
 */
router.put('/:id', 
  authorize(['admin', 'hr_manager'], true), 
  validateRequest(updateUserSchema), 
  userController.updateUser
);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete user
 * @access Private (Admin)
 */
router.delete('/:id', authorize(['admin']), userController.deleteUser);

/**
 * @route POST /api/v1/users/:id/roles
 * @desc Assign role to user
 * @access Private (Admin, HR Manager)
 */
router.post('/:id/roles', authorize(['admin', 'hr_manager']), userController.assignRole);

/**
 * @route DELETE /api/v1/users/:id/roles/:roleId
 * @desc Remove role from user
 * @access Private (Admin, HR Manager)
 */
router.delete('/:id/roles/:roleId', authorize(['admin', 'hr_manager']), userController.removeRole);

/**
 * @route PUT /api/v1/users/:id/status
 * @desc Update user status (active/inactive)
 * @access Private (Admin, HR Manager)
 */
router.put('/:id/status', authorize(['admin', 'hr_manager']), userController.updateUserStatus);

export default router;
