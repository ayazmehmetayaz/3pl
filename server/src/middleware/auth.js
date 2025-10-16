const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const logger = require('../utils/logger');
const db = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await db('users')
      .select('id', 'email', 'username', 'role', 'is_active', 'last_login')
      .where('id', decoded.id)
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed.'
    });
  }
};

// Check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user has module access
const checkModuleAccess = (moduleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not authenticated.'
        });
      }

      // Check if user has access to the module
      const moduleAccess = await db('user_modules')
        .select('*')
        .where('user_id', req.user.id)
        .where('module_name', moduleName)
        .where('is_active', true)
        .first();

      if (!moduleAccess) {
        return res.status(403).json({
          success: false,
          message: `Access denied. No permission to access ${moduleName} module.`
        });
      }

      next();
    } catch (error) {
      logger.error('Module access check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Module access check failed.'
      });
    }
  };
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const user = await db('users')
        .select('id', 'email', 'username', 'role', 'is_active')
        .where('id', decoded.id)
        .where('is_active', true)
        .first();

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};

module.exports = {
  verifyToken,
  authorize,
  checkModuleAccess,
  optionalAuth
};
