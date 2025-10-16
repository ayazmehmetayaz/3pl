import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/config/database';
import { CacheService } from '@/config/redis';
import { MessageQueueService, MessageTypes } from '@/config/rabbitmq';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Find user with roles
      const user = await db('users')
        .select(
          'users.*',
          'roles.id as role_id',
          'roles.name as role_name',
          'roles.permissions'
        )
        .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
        .leftJoin('roles', 'user_roles.role_id', 'roles.id')
        .where('users.email', email)
        .andWhere('users.is_active', true)
        .andWhere('user_roles.is_active', true)
        .first();

      if (!user || !user.password_hash) {
        throw new CustomError('Invalid email or password', 401);
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new CustomError('Invalid email or password', 401);
      }

      // Update last login
      await db('users')
        .where('id', user.id)
        .update({ last_login: new Date() });

      // Group roles
      const roles = [];
      if (user.role_id) {
        roles.push({
          id: user.role_id,
          name: user.role_name,
          permissions: JSON.parse(user.permissions || '[]')
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, tokenId: uuidv4() },
        jwtSecret,
        { expiresIn: jwtRefreshExpiresIn }
      );

      // Store refresh token in cache
      await CacheService.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;

      logger.info(`User ${email} logged in successfully`);

      res.json({
        success: true,
        data: {
          user: {
            ...userWithoutPassword,
            roles
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user already exists
      const existingUser = await db('users').where('email', email).first();
      if (existingUser) {
        throw new CustomError('User with this email already exists', 400);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, bcryptRounds);

      // Create user
      const [userId] = await db('users').insert({
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone,
        is_active: true,
        is_verified: false
      }).returning('id');

      // Assign default role (customer)
      const customerRole = await db('roles').where('name', 'customer').first();
      if (customerRole) {
        await db('user_roles').insert({
          user_id: userId.id,
          role_id: customerRole.id,
          is_active: true
        });
      }

      // Send verification email
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: email,
          template: 'email_verification',
          data: {
            firstName,
            email
          }
        }
      );

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification.'
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new CustomError('Refresh token required', 400);
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtSecret) as any;
      
      // Check if token exists in cache
      const cachedToken = await CacheService.get(`refresh_token:${decoded.userId}`);
      if (!cachedToken || cachedToken !== refreshToken) {
        throw new CustomError('Invalid refresh token', 401);
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { userId: decoded.userId, tokenId: uuidv4() },
        jwtSecret,
        { expiresIn: jwtRefreshExpiresIn }
      );

      // Update cache
      await CacheService.set(`refresh_token:${decoded.userId}`, newRefreshToken, 7 * 24 * 60 * 60);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        // Remove refresh token from cache
        await CacheService.del(`refresh_token:${req.user.id}`);
        
        logger.info(`User ${req.user.email} logged out`);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await db('users').where('email', email).first();
      if (!user) {
        // Don't reveal if user exists or not
        res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent.'
        });
        return;
      }

      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await CacheService.set(`password_reset:${resetToken}`, user.id, 3600);

      // Send reset email
      await MessageQueueService.publishToExchange(
        MessageTypes.EMAIL.exchange,
        MessageTypes.EMAIL.routingKey,
        {
          to: email,
          template: 'password_reset',
          data: {
            firstName: user.first_name,
            resetToken
          }
        }
      );

      logger.info(`Password reset requested for: ${email}`);

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.'
      });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const userId = await CacheService.get(`password_reset:${token}`);
      if (!userId) {
        throw new CustomError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(password, bcryptRounds);

      // Update password
      await db('users')
        .where('id', userId)
        .update({ password_hash: passwordHash });

      // Remove reset token
      await CacheService.del(`password_reset:${token}`);

      logger.info(`Password reset completed for user: ${userId}`);

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      // Get full user data
      const user = await db('users')
        .select(
          'users.id',
          'users.email',
          'users.first_name',
          'users.last_name',
          'users.phone',
          'users.avatar_url',
          'users.is_active',
          'users.is_verified',
          'users.last_login',
          'users.created_at',
          'users.updated_at'
        )
        .where('id', req.user.id)
        .first();

      res.json({
        success: true,
        data: {
          ...user,
          roles: req.user.roles
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      const { currentPassword, newPassword } = req.body;

      // Get current password hash
      const user = await db('users')
        .select('password_hash')
        .where('id', req.user.id)
        .first();

      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new CustomError('Current password is incorrect', 400);
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, bcryptRounds);

      // Update password
      await db('users')
        .where('id', req.user.id)
        .update({ password_hash: passwordHash });

      logger.info(`Password changed for user: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
