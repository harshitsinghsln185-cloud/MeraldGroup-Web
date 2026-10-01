import { Response } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/roleMiddleware';

/**
 * @desc Get all users with optional status/role filters
 * @route GET /api/v1/admin/users
 * @access HR, Accounts, Admin
 */
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status, role, search } = req.query;
    const query: any = {};

    if (status) {
      if (status === 'PENDING') query.isApproved = false;
      if (status === 'APPROVED') query.isApproved = true;
      if (status === 'REJECTED') query.approvalStatus = 'REJECTED';
    }

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('approvedBy', 'name email')
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

/**
 * @desc Get all pending approval user requests
 * @route GET /api/v1/admin/users/pending
 * @access HR only
 */
export const getPendingUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const pendingUsers = await User.find({ isApproved: false, approvalStatus: { $ne: 'REJECTED' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

/**
 * @desc Approve a pending user and assign final role
 * @route PUT /api/v1/admin/users/:id/approve
 * @access HR only
 */
export const approveUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, department } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User account not found' },
      });
      return;
    }

    user.isApproved = true;
    user.approvalStatus = 'APPROVED';
    if (role) user.role = role;
    if (department) user.department = department;
    user.approvedBy = req.user?.id as any;
    user.approvedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `User account for ${user.name} approved successfully with role ${user.role}.`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

/**
 * @desc Reject a pending user account
 * @route PUT /api/v1/admin/users/:id/reject
 * @access HR only
 */
export const rejectUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User account not found' },
      });
      return;
    }

    user.isApproved = false;
    user.approvalStatus = 'REJECTED';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account request for ${user.name} has been rejected.`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

/**
 * @desc Update user role or department
 * @route PUT /api/v1/admin/users/:id/role
 * @access HR only
 */
export const updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role, department, siteId } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User account not found' },
      });
      return;
    }

    if (role) user.role = role;
    if (department) user.department = department;
    if (siteId !== undefined) user.siteId = siteId;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User permissions updated successfully.`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

/**
 * @desc Delete user account
 * @route DELETE /api/v1/admin/users/:id
 * @access HR only
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User account not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User account for ${user.name} deleted successfully.`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};
