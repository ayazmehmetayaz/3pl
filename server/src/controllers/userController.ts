import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '@/config/database';
import { AuthRequest } from '@/middleware/auth';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

export const userController = {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, status, role } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let query = db('users')
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
        );

      // Apply filters
      if (search) {
        query = query.where(function() {
          this.where('users.first_name', 'ilike', `%${search}%`)
            .orWhere('users.last_name', 'ilike', `%${search}%`)
            .orWhere('users.email', 'ilike', `%${search}%`);
        });
      }

      if (status) {
        query = query.where('users.is_active', status === 'active');
      }

      if (role) {
        query = query
          .join('user_roles', 'users.id', 'user_roles.user_id')
          .join('roles', 'user_roles.role_id', 'roles.id')
          .where('roles.name', role)
          .where('user_roles.is_active', true);
      }

      // Get total count
      const countQuery = query.clone();
      const [{ count }] = await countQuery.count('* as count');

      // Get paginated results
      const users = await query
        .limit(Number(limit))
        .offset(offset)
        .orderBy('users.created_at', 'desc');

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const roles = await db('user_roles')
            .select('roles.id', 'roles.name', 'roles.description')
            .join('roles', 'user_roles.role_id', 'roles.id')
            .where('user_roles.user_id', user.id)
            .andWhere('user_roles.is_active', true);

          return {
            ...user,
            roles
          };
        })
      );

      res.json({
        success: true,
        data: usersWithRoles,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(count),
          totalPages: Math.ceil(Number(count) / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

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
        .where('users.id', id)
        .first();

      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Get user roles
      const roles = await db('user_roles')
        .select('roles.id', 'roles.name', 'roles.description', 'roles.permissions')
        .join('roles', 'user_roles.role_id', 'roles.id')
        .where('user_roles.user_id', id)
        .andWhere('user_roles.is_active', true);

      res.json({
        success: true,
        data: {
          ...user,
          roles: roles.map(role => ({
            ...role,
            permissions: JSON.parse(role.permissions || '[]')
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, phone, roles } = req.body;

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
        is_verified: true
      }).returning('id');

      // Assign roles
      if (roles && roles.length > 0) {
        const roleAssignments = roles.map((roleId: string) => ({
          user_id: userId.id,
          role_id: roleId,
          assigned_by: req.user?.id,
          is_active: true
        }));

        await db('user_roles').insert(roleAssignments);
      }

      logger.info(`User created: ${email} by ${req.user?.email}`);

      res.status(201).json({
        success: true,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, isActive } = req.body;

      // Check if user exists
      const user = await db('users').where('id', id).first();
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Update user
      await db('users')
        .where('id', id)
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          is_active: isActive,
          updated_at: new Date()
        });

      logger.info(`User updated: ${user.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Check if user exists
      const user = await db('users').where('id', id).first();
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Soft delete - deactivate user
      await db('users')
        .where('id', id)
        .update({
          is_active: false,
          updated_at: new Date()
        });

      // Deactivate all user roles
      await db('user_roles')
        .where('user_id', id)
        .update({ is_active: false });

      logger.info(`User deactivated: ${user.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async assignRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;

      // Check if user exists
      const user = await db('users').where('id', id).first();
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Check if role exists
      const role = await db('roles').where('id', roleId).first();
      if (!role) {
        throw new CustomError('Role not found', 404);
      }

      // Check if assignment already exists
      const existingAssignment = await db('user_roles')
        .where('user_id', id)
        .andWhere('role_id', roleId)
        .first();

      if (existingAssignment) {
        if (existingAssignment.is_active) {
          throw new CustomError('User already has this role', 400);
        } else {
          // Reactivate existing assignment
          await db('user_roles')
            .where('id', existingAssignment.id)
            .update({ is_active: true, assigned_at: new Date() });
        }
      } else {
        // Create new assignment
        await db('user_roles').insert({
          user_id: id,
          role_id: roleId,
          assigned_by: req.user?.id,
          is_active: true
        });
      }

      logger.info(`Role ${role.name} assigned to user ${user.email} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Role assigned successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async removeRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, roleId } = req.params;

      // Check if assignment exists
      const assignment = await db('user_roles')
        .where('user_id', id)
        .andWhere('role_id', roleId)
        .first();

      if (!assignment) {
        throw new CustomError('Role assignment not found', 404);
      }

      // Deactivate assignment
      await db('user_roles')
        .where('id', assignment.id)
        .update({ is_active: false });

      logger.info(`Role removed from user ${id} by ${req.user?.email}`);

      res.json({
        success: true,
        message: 'Role removed successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      // Check if user exists
      const user = await db('users').where('id', id).first();
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Update user status
      await db('users')
        .where('id', id)
        .update({
          is_active: isActive,
          updated_at: new Date()
        });

      // Update role statuses
      await db('user_roles')
        .where('user_id', id)
        .update({ is_active: isActive });

      logger.info(`User ${user.email} status changed to ${isActive ? 'active' : 'inactive'} by ${req.user?.email}`);

      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      next(error);
    }
  }
};
