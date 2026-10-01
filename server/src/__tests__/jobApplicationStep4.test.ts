import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import JobVacancy from '../models/JobVacancy';
import JobApplication from '../models/JobApplication';
import { submitJobApplication } from '../controllers/jobApplicationController';
import { verifyFileSignature } from '../utils/fileSignature';
import * as emailService from '../services/emailService';

describe('Step 4: Job Application Submission API Unit & Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validPdfBuffer = Buffer.from('%PDF-1.4 Sample valid PDF content', 'utf-8');
  const validDocxBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]);
  const invalidFakeBuffer = Buffer.from('Plain text content masquerading as pdf', 'utf-8');

  const validApplicationBody = {
    jobId: '60d5ecb8b5c9c2415c8e3112',
    firstName: 'Arun',
    lastName: 'Kumar',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    passportNumber: 'Z9876543',
    experienceYears: 6,
    email: 'arun.kumar@example.com',
    phone: '+919876543210',
    previousCompany: 'L&T Construction',
    previousRole: 'Site Engineer',
    previousCTC: { amount: 650000, currency: 'INR' },
  };

  describe('fileSignature Utility', () => {
    it('approves valid PDF and PNG for passport category', () => {
      expect(verifyFileSignature(validPdfBuffer, 'passport', 'passport.pdf')).toBe(true);
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(verifyFileSignature(pngBuffer, 'passport', 'scan.png')).toBe(true);
    });

    it('approves valid PDF and DOCX for resume category', () => {
      expect(verifyFileSignature(validPdfBuffer, 'resume', 'resume.pdf')).toBe(true);
      expect(verifyFileSignature(validDocxBuffer, 'resume', 'resume.docx')).toBe(true);
    });

    it('rejects fake file with wrong magic bytes', () => {
      expect(verifyFileSignature(invalidFakeBuffer, 'passport', 'passport.pdf')).toBe(false);
      expect(verifyFileSignature(invalidFakeBuffer, 'resume', 'cv.pdf')).toBe(false);
    });
  });

  describe('submitJobApplication Handler', () => {
    it('submits job application successfully (201 Created)', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        title: 'Senior Site Engineer',
        status: 'PUBLISHED',
        hiredCount: 0,
        openingsCount: 3,
      } as any);

      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const mockSave = vi.fn().mockResolvedValue(true);
      vi.spyOn(JobApplication.prototype, 'save').mockImplementation(mockSave);
      vi.spyOn(emailService, 'sendApplicationConfirmationEmail').mockResolvedValue(true);

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Job application submitted successfully!',
        })
      );
    });

    it('rejects application when required text field is missing (400 Bad Request)', async () => {
      const req: any = {
        body: { firstName: 'Arun' }, // Missing required fields
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({ code: 'VALIDATION_ERROR' }),
        })
      );
    });

    it('rejects application when vacancy is not PUBLISHED or fully hired (400 Bad Request)', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        title: 'Closed Engineer',
        status: 'CLOSED', // Closed vacancy
        hiredCount: 2,
        openingsCount: 2,
      } as any);

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'This position is no longer accepting applications.',
          }),
        })
      );
    });

    it('rejects application when either file is missing (400 Bad Request)', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          // Missing resumeFile
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        status: 'PUBLISHED',
        hiredCount: 0,
        openingsCount: 2,
      } as any);

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Both passport document and resume file are required.',
          }),
        })
      );
    });

    it('rejects application when file magic bytes do not match extension (400 Bad Request)', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: invalidFakeBuffer, originalname: 'passport.pdf' }], // Fake PDF!
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        status: 'PUBLISHED',
        hiredCount: 0,
        openingsCount: 2,
      } as any);

      const unlinkSpy = vi.spyOn(fs, 'unlinkSync');

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'INVALID_FILE_SIGNATURE',
            message: 'Invalid file signature. File content does not match extension.',
          }),
        })
      );
      // Confirm file was NOT written / left behind
      expect(unlinkSpy).not.toHaveBeenCalled();
    });

    it('handles duplicate passport submission gracefully with clean 400 Bad Request', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        title: 'Engineer',
        status: 'PUBLISHED',
        hiredCount: 0,
        openingsCount: 2,
      } as any);

      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      const duplicateError: any = new Error('Duplicate key');
      duplicateError.code = 11000;
      vi.spyOn(JobApplication.prototype, 'save').mockRejectedValue(duplicateError);

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'DUPLICATE_APPLICATION',
            message: expect.stringContaining('You have already submitted an application for this vacancy'),
          }),
        })
      );
    });

    it('succeeds with 201 Created even if confirmation email dispatch fails silently', async () => {
      const req: any = {
        body: validApplicationBody,
        files: {
          passportFile: [{ buffer: validPdfBuffer, originalname: 'passport.pdf' }],
          resumeFile: [{ buffer: validPdfBuffer, originalname: 'resume.pdf' }],
        },
      };
      const res: any = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      vi.spyOn(JobVacancy, 'findById').mockResolvedValue({
        _id: '60d5ecb8b5c9c2415c8e3112',
        title: 'Engineer',
        status: 'PUBLISHED',
        hiredCount: 0,
        openingsCount: 2,
      } as any);

      vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(JobApplication.prototype, 'save').mockResolvedValue(true as any);

      // Email service throws an error
      vi.spyOn(emailService, 'sendApplicationConfirmationEmail').mockRejectedValue(
        new Error('SMTP Connection Refused')
      );

      await submitJobApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Job application submitted successfully!',
        })
      );
    });
  });
});
