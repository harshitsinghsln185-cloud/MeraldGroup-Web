import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserRole } from './roleMiddleware';
import User from '../models/User';

export interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  siteId?: string;
  isApproved?: boolean;
  iat: number;
  exp: number;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authorization token missing' },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'merald_group_super_secret_jwt_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    const dbUser = await User.findById(decoded.id);

    if (!dbUser) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_USER', message: 'User account no longer exists' },
      });
      return;
    }

    if (!dbUser.isApproved || dbUser.approvalStatus !== 'APPROVED') {
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_PENDING_APPROVAL',
          message: 'Your account is pending HR approval. Please contact HR to activate your account.',
        },
      });
      return;
    }

    req.user = {
      id: (dbUser._id as any).toString(),
      email: dbUser.email,
      role: dbUser.role,
      siteId: dbUser.siteId,
    };
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token expired or invalid' },
    });
  }
};
