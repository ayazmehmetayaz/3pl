const express = require('express');
const { authController } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
// const { validateRequest } = require('../middleware/validateRequest');
// const { 
//   loginSchema, 
//   registerSchema, 
//   refreshTokenSchema, 
//   forgotPasswordSchema, 
//   resetPasswordSchema, 
//   changePasswordSchema 
// } = require('../schemas/authSchemas');

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
