const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { logger } = require('../utils/logger');
const { validateRequest } = require('../middleware/validateRequest');
const { loginSchema, registerSchema } = require('../schemas/authSchemas');

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db('users')
      .where({ email })
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız deaktif durumda'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
    }

    // Get user roles and permissions
    const roles = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .join('role_permissions', 'roles.id', 'role_permissions.role_id')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .where('user_roles.user_id', user.id)
      .select(
        'roles.name as roleName',
        'roles.description as roleDescription',
        'permissions.name as permissionName',
        'permissions.description as permissionDescription'
      );

    // Group permissions by role
    const userRoles = {};
    roles.forEach(role => {
      if (!userRoles[role.roleName]) {
        userRoles[role.roleName] = {
          name: role.roleName,
          description: role.roleDescription,
          permissions: []
        };
      }
      userRoles[role.roleName].permissions.push({
        name: role.permissionName,
        description: role.permissionDescription
      });
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: Object.keys(userRoles)
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    await db('users')
      .where({ id: user.id })
      .update({ lastLogin: new Date() });

    logger.info(`User ${email} logged in successfully`);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          roles: Object.values(userRoles)
        },
        accessToken: token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Register Controller
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, roleId } = req.body;

    // Check if user already exists
    const existingUser = await db('users')
      .where({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [userId] = await db('users').insert({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Assign role
    if (roleId) {
      await db('user_roles').insert({
        user_id: userId,
        role_id: roleId,
        assigned_at: new Date()
      });
    }

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        userId,
        email
      }
    });

  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Refresh Token Controller
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token gerekli'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        roles: decoded.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Geçersiz refresh token'
    });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db('users')
      .where({ email })
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to database
    await db('password_resets').insert({
      user_id: user.id,
      token: resetToken,
      expires_at: new Date(Date.now() + 3600000), // 1 hour
      created_at: new Date()
    });

    // In a real application, send email with reset link
    logger.info(`Password reset token generated for ${email}`);

    res.json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token exists in database
    const resetRecord = await db('password_resets')
      .where({ token, user_id: decoded.userId })
      .where('expires_at', '>', new Date())
      .first();

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db('users')
      .where({ id: decoded.userId })
      .update({ 
        password: hashedPassword,
        updatedAt: new Date()
      });

    // Delete reset token
    await db('password_resets')
      .where({ token })
      .del();

    logger.info(`Password reset successful for user ${decoded.userId}`);

    res.json({
      success: true,
      message: 'Şifre başarıyla güncellendi'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};
