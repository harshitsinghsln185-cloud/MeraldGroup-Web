import { Request, Response } from 'express';
import JobVacancy from '../models/JobVacancy';
import JobApplication from '../models/JobApplication';
import Notification from '../models/Notification';
import { createJobVacancySchema } from '../validators/jobVacancyValidator';
import { UserRole } from '../middleware/roleMiddleware';

/**
 * POST /api/v1/admin/vacancies
 * Create a new Job Vacancy (Protected: HR, ADMIN)
 */
export const createVacancy = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createJobVacancySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: parseResult.error.issues,
        },
      });
      return;
    }

    const userId = (req as any).user?.id;
    const vacancyData = {
      ...parseResult.data,
      status: parseResult.data.status || 'DRAFT',
      hiredCount: 0,
      createdBy: userId,
    };

    const vacancy = await JobVacancy.create(vacancyData);
    res.status(201).json({
      success: true,
      message: 'Job vacancy created successfully',
      data: vacancy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to create job vacancy' },
    });
  }
};

/**
 * PUT /api/v1/admin/vacancies/:id
 * Update Job Vacancy details (Protected: HR, ADMIN)
 */
export const updateVacancy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parseResult = createJobVacancySchema.partial().safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: parseResult.error.issues,
        },
      });
      return;
    }

    const updated = await JobVacancy.findByIdAndUpdate(id, parseResult.data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job vacancy updated successfully',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to update job vacancy' },
    });
  }
};

/**
 * GET /api/v1/admin/vacancies
 * List all job vacancies (DRAFT, PUBLISHED, CLOSED) for Admin/HR with pagination
 */
export const getAdminVacancies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.location) filter.location = req.query.location;
    if (req.query.department) filter.department = req.query.department;

    const total = await JobVacancy.countDocuments(filter);
    const vacancies = await JobVacancy.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: vacancies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch vacancies' },
    });
  }
};

/**
 * GET /api/v1/vacancies
 * Public job vacancies listing (PUBLISHED & unexpired & openings available)
 */
export const getPublicVacancies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const now = new Date();

    const filter: Record<string, unknown> = {
      status: 'PUBLISHED',
      $or: [{ closingDate: { $exists: false } }, { closingDate: null }, { closingDate: { $gt: now } }],
      $expr: { $lt: ['$hiredCount', '$openingsCount'] },
    };

    if (req.query.location) filter.location = req.query.location;
    if (req.query.department) filter.department = req.query.department;

    const total = await JobVacancy.countDocuments(filter);
    const vacancies = await JobVacancy.find(filter)
      .select('-createdBy -__v')
      .sort({ postedDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: vacancies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch public vacancies' },
    });
  }
};

/**
 * GET /api/v1/vacancies/:id
 * Get single vacancy details (Public allows PUBLISHED only; Admin/HR allows any status)
 */
export const getVacancyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = (req as any).user?.role as UserRole | undefined;
    const isAdminOrHR = userRole === 'HR' || userRole === 'ADMIN';

    const vacancy = await JobVacancy.findById(id);
    if (!vacancy) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
      return;
    }

    if (!isAdminOrHR && vacancy.status !== 'PUBLISHED') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: vacancy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch job vacancy' },
    });
  }
};

/**
 * PATCH /api/v1/admin/vacancies/:id/status
 * Toggle Job Vacancy Status ('DRAFT', 'PUBLISHED', 'CLOSED')
 */
export const updateVacancyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'CLOSED'].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid status value' },
      });
      return;
    }

    const vacancy = await JobVacancy.findById(id);
    if (!vacancy) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
      return;
    }

    // Reopening check
    if (status === 'PUBLISHED' && vacancy.status === 'CLOSED') {
      if (vacancy.hiredCount >= vacancy.openingsCount) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cannot reopen a closed vacancy when hired count has reached or exceeded openings count',
          },
        });
        return;
      }
    }

    if (status === 'PUBLISHED') {
      if (!vacancy.postedDate) {
        vacancy.postedDate = new Date();
      }

      await Notification.create({
        title: 'New Job Vacancy Published',
        message: `${vacancy.title} (${vacancy.location}) is now active on the Career Portal.`,
        type: 'JOB_VACANCY',
        link: '/admin/vacancies',
        targetRoles: ['HR', 'ADMIN'],
      });
    }

    vacancy.status = status;
    await vacancy.save();

    res.status(200).json({
      success: true,
      message: `Job vacancy status updated to ${status}`,
      data: vacancy,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to update vacancy status' },
    });
  }
};

/**
 * DELETE /api/v1/admin/vacancies/:id
 * Delete job vacancy if zero applications exist
 */
export const deleteVacancy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const applicationCount = await JobApplication.countDocuments({ jobId: id });
    if (applicationCount > 0) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Cannot delete a vacancy that has received applications.',
        },
      });
      return;
    }

    const deleted = await JobVacancy.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job vacancy deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to delete job vacancy' },
    });
  }
};
