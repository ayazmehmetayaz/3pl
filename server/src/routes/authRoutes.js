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
router.get('/me', authenticate, (req, res) => res.json({ success: true, user: req.user }));
router.post('/logout', authenticate, (req, res) => res.json({ success: true, message: 'Çıkış başarılı' }));
router.post('/change-password', authenticate, (req, res) => res.json({ success: true, message: 'Şifre değiştirildi' }));

module.exports = router;
