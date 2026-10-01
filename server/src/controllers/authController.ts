import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import PasswordResetToken from '../models/PasswordResetToken';
import { sendOTPEmail } from '../services/emailService';
import { AuthenticatedRequest, UserRole } from '../middleware/roleMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'merald_group_super_secret_jwt_key_2026';

const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, department } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name, email and password are required' },
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists' },
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      department: department || 'General',
      role: 'SITE_SUPERVISOR',
      isApproved: false,
      approvalStatus: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Your account is pending HR approval before you can access the system.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Error registering account' },
    });
  }
};

const VALID_ROLES: UserRole[] = ['HR', 'ACCOUNTS', 'ADMIN', 'SITE_SUPERVISOR'];

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role || !VALID_ROLES.includes(role as UserRole)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Email, password, and a valid access role (HR, ACCOUNTS, ADMIN, SITE_SUPERVISOR) are required',
        },
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    // Role verification: check if selected role matches user's assigned role in DB
    if (user.role !== role) {
      res.status(403).json({
        success: false,
        error: {
          code: 'ROLE_UNAUTHORIZED',
          message: `You are not authorized for the selected role '${role}'. Your registered role is '${user.role}'.`,
        },
      });
      return;
    }

    if (!user.isApproved || user.approvalStatus !== 'APPROVED') {
      res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_PENDING_APPROVAL',
          message: 'Your account is pending HR approval. Please contact HR to activate your account.',
        },
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        siteId: user.siteId,
        isApproved: user.isApproved,
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          siteId: user.siteId,
          avatar: user.avatar,
          isApproved: user.isApproved,
          approvalStatus: user.approvalStatus,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Error logging in' },
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User profile not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        siteId: user.siteId,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Registered email address is required' },
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success to avoid email enumeration attack
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a 6-digit OTP code has been sent.',
      });
      return;
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Invalidate existing tokens for this email
    await PasswordResetToken.updateMany({ email: user.email.toLowerCase() }, { used: true });

    // Store hashed token in DB
    await PasswordResetToken.create({
      email: user.email.toLowerCase(),
      otpHash,
      expiresAt,
      used: false,
    });

    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      success: true,
      message: 'A 6-digit OTP code has been sent to your email address.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email and OTP code are required' },
      });
      return;
    }

    const otpHash = hashOTP(otp);
    const tokenDoc = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      otpHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_OTP', message: 'Invalid, used, or expired OTP code' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email, OTP, and new password are required' },
      });
      return;
    }

    const otpHash = hashOTP(otp);
    const tokenDoc = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      otpHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_OTP', message: 'Invalid session or expired OTP' },
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User account not found' },
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    tokenDoc.used = true;
    await tokenDoc.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};
