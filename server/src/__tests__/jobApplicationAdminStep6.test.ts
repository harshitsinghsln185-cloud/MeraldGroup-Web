import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import JobApplication from '../models/JobApplication';
import JobVacancy from '../models/JobVacancy';
import {
  getApplicants,
  updateApplicantStatus,
  getApplicantDocument,
} from '../controllers/jobApplicationAdminController';

vi.mock('../models/JobApplication');
vi.mock('../models/JobVacancy');

describe('Step 6: Job Application Admin & ATS Controller Unit Tests', () => {
  let req: Partial<Request>;
  let res: Response;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let sendFileMock: ReturnType<typeof vi.fn>;
  let setHeaderMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    sendFileMock = vi.fn();
    setHeaderMock = vi.fn();

    req = {
      query: {},
      params: {},
      body: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
      sendFile: sendFileMock,
      setHeader: setHeaderMock,
    } as unknown as Response;

    vi.clearAllMocks();
  });

  describe('getApplicants Handler', () => {
    it('returns paginated applicants list and maps name while excluding raw document paths', async () => {
      req.query = { page: '1', limit: '10' };

      const mockApps = [
        {
          _id: 'app123',
          jobId: 'job456',
          jobTitle: 'Senior MEP Engineer',
          firstName: 'Rahul',
          middleName: 'K.',
          lastName: 'Sharma',
          email: 'rahul@example.com',
          phone: '+919876543210',
          passportNumber: 'Z9876543',
          experienceYears: 5,
          previousCompany: 'L&T',
          previousRole: 'Site Supervisor',
          previousCTC: { amount: 650000, currency: 'INR' },
          status: 'NEW',
          createdAt: new Date(),
        },
      ];

      (JobApplication.countDocuments as any).mockResolvedValue(1);
      (JobApplication.find as any).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockApps),
          }),
        }),
      });

      await getApplicants(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: [
            expect.objectContaining({
              _id: 'app123',
              name: 'Rahul K. Sharma',
              email: 'rahul@example.com',
              passportNumber: 'Z9876543',
            }),
          ],
          pagination: { page: 1, limit: 10, total: 1, pages: 1 },
        })
      );
    });

    it('applies name and passportNumber query filters correctly', async () => {
      req.query = { name: 'Rahul', passportNumber: 'Z9876543', status: 'NEW' };

      (JobApplication.countDocuments as any).mockResolvedValue(0);
      (JobApplication.find as any).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      await getApplicants(req as Request, res);

      expect(JobApplication.countDocuments).toHaveBeenCalledWith(
        expect.objectContaining({
          passportNumber: expect.any(RegExp),
          status: 'NEW',
          $or: expect.arrayContaining([
            { firstName: expect.any(RegExp) },
            { middleName: expect.any(RegExp) },
            { lastName: expect.any(RegExp) },
          ]),
        })
      );
      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('updateApplicantStatus Handler & Idempotency', () => {
    it('rejects invalid status with 400 Bad Request', async () => {
      req.params = { id: 'app123' };
      req.body = { status: 'INVALID_STATUS' };

      await updateApplicantStatus(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
        })
      );
    });

    it('returns 404 if application is not found', async () => {
      req.params = { id: 'app999' };
      req.body = { status: 'HIRED' };

      (JobApplication.findById as any).mockResolvedValue(null);

      await updateApplicantStatus(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('atomically increments hiredCount on transition to HIRED and auto-closes vacancy when quota reached', async () => {
      req.params = { id: 'app123' };
      req.body = { status: 'HIRED', notes: 'Excellent candidate' };

      const mockApp = {
        _id: 'app123',
        jobId: 'vacancy456',
        jobTitle: 'Site Manager',
        firstName: 'Amit',
        lastName: 'Patel',
        status: 'SHORTLISTED',
        notes: '',
        save: vi.fn().mockResolvedValue(true),
      };

      const mockVacancy = {
        _id: 'vacancy456',
        status: 'PUBLISHED',
        openingsCount: 1,
        hiredCount: 1,
        save: vi.fn().mockResolvedValue(true),
      };

      (JobApplication.findById as any).mockResolvedValue(mockApp);
      (JobVacancy.findOneAndUpdate as any).mockResolvedValue(mockVacancy);

      await updateApplicantStatus(req as Request, res);

      expect(JobVacancy.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'vacancy456', status: 'PUBLISHED' },
        { $inc: { hiredCount: 1 } },
        { new: true }
      );
      expect(mockVacancy.status).toBe('CLOSED');
      expect(mockVacancy.save).toHaveBeenCalled();
      expect(mockApp.status).toBe('HIRED');
      expect(mockApp.notes).toBe('Excellent candidate');
      expect(mockApp.save).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('is idempotent: does NOT increment hiredCount if current status is already HIRED', async () => {
      req.params = { id: 'app123' };
      req.body = { status: 'HIRED', notes: 'Re-confirming hire' };

      const mockApp = {
        _id: 'app123',
        jobId: 'vacancy456',
        status: 'HIRED',
        notes: '',
        save: vi.fn().mockResolvedValue(true),
      };

      (JobApplication.findById as any).mockResolvedValue(mockApp);

      await updateApplicantStatus(req as Request, res);

      expect(JobVacancy.findOneAndUpdate).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('decrements hiredCount when changing status away from HIRED, ensuring it never goes below 0', async () => {
      req.params = { id: 'app123' };
      req.body = { status: 'REJECTED', notes: 'Correction after offer decline' };

      const mockApp = {
        _id: 'app123',
        jobId: 'vacancy456',
        status: 'HIRED',
        notes: '',
        save: vi.fn().mockResolvedValue(true),
      };

      (JobApplication.findById as any).mockResolvedValue(mockApp);
      (JobVacancy.findOneAndUpdate as any).mockResolvedValue({});

      await updateApplicantStatus(req as Request, res);

      expect(JobVacancy.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'vacancy456', hiredCount: { $gt: 0 } },
        { $inc: { hiredCount: -1 } }
      );
      expect(mockApp.status).toBe('REJECTED');
      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe('getApplicantDocument Handler & Security Guards', () => {
    it('rejects invalid docType with 400 Bad Request', async () => {
      req.params = { id: 'app123', docType: 'invalid_doc' };

      await getApplicantDocument(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
        })
      );
    });

    it('returns 404 for non-existent application ID', async () => {
      req.params = { id: 'app999', docType: 'passport' };

      (JobApplication.findById as any).mockResolvedValue(null);

      await getApplicantDocument(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('rejects path-traversal attempts with 403 Forbidden', async () => {
      req.params = { id: 'app123', docType: 'passport' };

      const mockApp = {
        _id: 'app123',
        passportDocumentUrl: '/uploads/../../etc/passwd',
      };

      (JobApplication.findById as any).mockResolvedValue(mockApp);

      await getApplicantDocument(req as Request, res);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'FORBIDDEN' }),
        })
      );
    });
  });
});
