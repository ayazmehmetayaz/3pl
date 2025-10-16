import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { validateRequest } from '@/middleware/validateRequest';
import { loginSchema, registerSchema, refreshTokenSchema } from '@/schemas/authSchemas';
import { authRateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimiter);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authController.logout);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authController.getMe);

/**
 * @route PUT /api/v1/auth/change-password
 * @desc Change password
 * @access Private
 */
router.put('/change-password', authController.changePassword);

export default router;
