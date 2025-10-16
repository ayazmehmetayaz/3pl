import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '@/config/database';
import { CustomError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: Array<{
      id: string;
      name: string;
      permissions: string[];
    }>;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Access token required', 401);
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new CustomError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user with roles from database
    const user = await db('users')
      .select(
        'users.id',
        'users.email',
        'users.first_name',
        'users.last_name',
        'users.is_active',
        'roles.id as role_id',
        'roles.name as role_name',
        'roles.permissions'
      )
      .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
      .leftJoin('roles', 'user_roles.role_id', 'roles.id')
      .where('users.id', decoded.userId)
      .andWhere('users.is_active', true)
      .andWhere('user_roles.is_active', true);

    if (!user.length) {
      throw new CustomError('User not found or inactive', 401);
    }

    // Group roles and permissions
    const userRoles = user.reduce((acc: any, row: any) => {
      if (row.role_id && !acc.find((r: any) => r.id === row.role_id)) {
        acc.push({
          id: row.role_id,
          name: row.role_name,
          permissions: JSON.parse(row.permissions || '[]')
        });
      }
      return acc;
    }, []);

    req.user = {
      id: user[0].id,
      email: user[0].email,
      roles: userRoles
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (allowedRoles: string[] = [], allowSelfAccess: boolean = false) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      const userRoles = req.user.roles.map(role => role.name);
      
      // Check if user has any of the allowed roles
      const hasRole = allowedRoles.length === 0 || allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        // If allowSelfAccess is true, check if user is accessing their own data
        if (allowSelfAccess) {
          const resourceId = req.params.id;
          if (resourceId !== req.user.id) {
            throw new CustomError('Insufficient permissions', 403);
          }
        } else {
          throw new CustomError('Insufficient permissions', 403);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requirePermission = (permission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new CustomError('Authentication required', 401);
      }

      const userPermissions = req.user.roles.flatMap(role => role.permissions);
      const hasPermission = userPermissions.some(p => 
        p === permission || 
        p === '*' ||
        (p.endsWith('.*') && permission.startsWith(p.slice(0, -2)))
      );

      if (!hasPermission) {
        throw new CustomError(`Permission required: ${permission}`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
