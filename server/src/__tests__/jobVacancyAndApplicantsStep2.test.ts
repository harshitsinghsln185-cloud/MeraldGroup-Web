import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import JobVacancy from '../models/JobVacancy';
import JobApplication from '../models/JobApplication';
import Notification from '../models/Notification';
import {
  createVacancy,
  updateVacancy,
  getAdminVacancies,
  getPublicVacancies,
  getVacancyById,
  updateVacancyStatus,
  deleteVacancy,
} from '../controllers/jobController';
import { checkModuleAccess, AuthenticatedRequest } from '../middleware/roleMiddleware';

describe('Step 2: Job Vacancy Controller & Routes Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validVacancyPayload = {
    title: 'Senior MEP Engineer',
    department: 'MEP',
    salaryPackage: { amount: 85000, currency: 'INR' },
    location: 'India',
    experienceRequired: '5 Years',
    ageRequirement: '25-35 Years',
    facilitiesProvided: ['Medical Insurance', 'Transport'],
    recruitmentProcess: [{ stepNumber: 1, title: 'Screening', description: 'HR call' }],
    degreeRequired: 'B.Tech Electrical',
    skillsRequired: ['AutoCAD', 'PLC'],
    documentsRequired: ['Passport'],
    openingsCount: 3,
  };

  describe('createVacancy', () => {
    it('creates a draft vacancy successfully for HR user', async () => {
      const req: any = {
        body: validVacancyPayload,
        user: { id: 'usr123', role: 'HR' },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const createdMock = { _id: 'vac123', ...validVacancyPayload, status: 'DRAFT', hiredCount: 0, createdBy: 'usr123' };
      vi.spyOn(JobVacancy, 'create').mockResolvedValue(createdMock as any);

      await createVacancy(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: createdMock,
        })
      );
    });

    it('rejects creation when required fields are missing', async () => {
      const req: any = {
        body: { title: 'Incomplete Vacancy' },
        user: { id: 'usr123', role: 'HR' },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await createVacancy(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
        })
      );
    });
  });

  describe('getPublicVacancies', () => {
    it('queries published, non-expired vacancies with pagination', async () => {
      const req: any = { query: { page: '1', limit: '10', location: 'India' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockVacancies = [
        { _id: 'v1', title: 'Job 1', status: 'PUBLISHED', location: 'India' },
      ];

      vi.spyOn(JobVacancy, 'countDocuments').mockResolvedValue(1);
      vi.spyOn(JobVacancy, 'find').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue(mockVacancies),
      } as any);

      await getPublicVacancies(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockVacancies,
          pagination: expect.objectContaining({ total: 1, page: 1 }),
        })
      );
    });
  });

  describe('getVacancyById', () => {
    it('returns 404 for public request when vacancy is DRAFT', async () => {
      const req: any = { params: { id: 'vac_draft' }, user: undefined };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({ _id: 'vac_draft', status: 'DRAFT' } as any);

      await getVacancyById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'NOT_FOUND' }),
        })
      );
    });

    it('returns vacancy for Admin request even when DRAFT', async () => {
      const req: any = { params: { id: 'vac_draft' }, user: { id: 'admin1', role: 'ADMIN' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockVacancy = { _id: 'vac_draft', status: 'DRAFT', title: 'Draft Job' };
      vi.spyOn(JobVacancy, 'findById').mockResolvedValue(mockVacancy as any);

      await getVacancyById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockVacancy,
      });
    });
  });

  describe('updateVacancyStatus', () => {
    it('publishes a vacancy and creates a notification targeted to HR and ADMIN', async () => {
      const req: any = { params: { id: 'v1' }, body: { status: 'PUBLISHED' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockVacancy: any = {
        _id: 'v1',
        title: 'Senior Engineer',
        location: 'India',
        status: 'DRAFT',
        hiredCount: 0,
        openingsCount: 2,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue(mockVacancy);
      vi.spyOn(Notification, 'create').mockResolvedValue({ _id: 'notif1' } as any);

      await updateVacancyStatus(req, res);

      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Job Vacancy Published',
          type: 'JOB_VACANCY',
          targetRoles: ['HR', 'ADMIN'],
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockVacancy.status).toBe('PUBLISHED');
    });

    it('rejects reopening a CLOSED vacancy when hiredCount >= openingsCount', async () => {
      const req: any = { params: { id: 'v1' }, body: { status: 'PUBLISHED' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockVacancy: any = {
        _id: 'v1',
        status: 'CLOSED',
        hiredCount: 2,
        openingsCount: 2,
        save: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue(mockVacancy);

      await updateVacancyStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Cannot reopen a closed vacancy when hired count has reached or exceeded openings count',
          }),
        })
      );
    });

    it('allows reopening a CLOSED vacancy when hiredCount < openingsCount', async () => {
      const req: any = { params: { id: 'v1' }, body: { status: 'PUBLISHED' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const mockVacancy: any = {
        _id: 'v1',
        title: 'Engineer',
        location: 'India',
        status: 'CLOSED',
        hiredCount: 1,
        openingsCount: 3,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue(mockVacancy);
      vi.spyOn(Notification, 'create').mockResolvedValue({ _id: 'n1' } as any);

      await updateVacancyStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockVacancy.status).toBe('PUBLISHED');
    });
  });

  describe('deleteVacancy', () => {
    it('rejects deletion with 400 if JobApplications exist for the vacancy', async () => {
      const req: any = { params: { id: 'vac1' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobApplication, 'countDocuments').mockResolvedValue(2);

      await deleteVacancy(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Cannot delete a vacancy that has received applications.',
          }),
        })
      );
    });

    it('deletes vacancy successfully when zero applications exist', async () => {
      const req: any = { params: { id: 'vac1' } };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobApplication, 'countDocuments').mockResolvedValue(0);
      vi.spyOn(JobVacancy, 'findByIdAndDelete').mockResolvedValue({ _id: 'vac1' } as any);

      await deleteVacancy(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Job vacancy deleted successfully',
        })
      );
    });
  });

  describe('RBAC Route Protection', () => {
    it('blocks ACCOUNTS and SITE_SUPERVISOR on applicant_tracking write routes', () => {
      const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      const accountsReq: Partial<AuthenticatedRequest> = { user: { id: 'u1', email: 'acc@test.com', role: 'ACCOUNTS' } };
      checkModuleAccess('applicant_tracking', 'write')(accountsReq as AuthenticatedRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();

      const supervisorReq: Partial<AuthenticatedRequest> = { user: { id: 'u2', email: 'sup@test.com', role: 'SITE_SUPERVISOR' } };
      checkModuleAccess('applicant_tracking', 'write')(supervisorReq as AuthenticatedRequest, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('permits HR and ADMIN on applicant_tracking write routes', () => {
      const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const nextHr = vi.fn();
      const nextAdmin = vi.fn();

      const hrReq: Partial<AuthenticatedRequest> = { user: { id: 'u1', email: 'hr@test.com', role: 'HR' } };
      checkModuleAccess('applicant_tracking', 'write')(hrReq as AuthenticatedRequest, res, nextHr);
      expect(nextHr).toHaveBeenCalled();

      const adminReq: Partial<AuthenticatedRequest> = { user: { id: 'u2', email: 'admin@test.com', role: 'ADMIN' } };
      checkModuleAccess('applicant_tracking', 'write')(adminReq as AuthenticatedRequest, res, nextAdmin);
      expect(nextAdmin).toHaveBeenCalled();
    });
  });
});
