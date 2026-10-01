import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import JobApplication from '../models/JobApplication';
import JobVacancy from '../models/JobVacancy';

/**
 * GET /api/v1/admin/applicants
 * List job applications with server-side pagination & filtering
 * (Protected: HR, ADMIN via 'applicant_tracking' read permission)
 */
export const getApplicants = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Filter by Candidate Name (partial match across first, middle, last name)
    if (req.query.name && String(req.query.name).trim()) {
      const nameRegex = new RegExp(String(req.query.name).trim(), 'i');
      filter.$or = [
        { firstName: nameRegex },
        { middleName: nameRegex },
        { lastName: nameRegex },
      ];
    }

    // Filter by Passport Number (case-insensitive partial or exact)
    if (req.query.passportNumber && String(req.query.passportNumber).trim()) {
      filter.passportNumber = new RegExp(String(req.query.passportNumber).trim(), 'i');
    }

    // Filter by specific Vacancy ID
    if (req.query.jobId && String(req.query.jobId).trim()) {
      filter.jobId = req.query.jobId;
    }

    // Filter by Status
    if (req.query.status && String(req.query.status).trim()) {
      filter.status = req.query.status;
    }

    const total = await JobApplication.countDocuments(filter);
    const applications = await JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Map output to combine full name and exclude raw server file paths
    const mappedData = applications.map((app) => {
      const nameParts = [app.firstName, app.middleName, app.lastName].filter(Boolean);
      return {
        _id: app._id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        firstName: app.firstName,
        middleName: app.middleName,
        lastName: app.lastName,
        name: nameParts.join(' '),
        email: app.email,
        phone: app.phone,
        whatsAppNumber: app.whatsAppNumber,
        country: app.country,
        state: app.state,
        city: app.city,
        passportNumber: app.passportNumber,
        experienceYears: app.experienceYears,
        previousCompany: app.previousCompany,
        previousRole: app.previousRole,
        previousCTC: app.previousCTC,
        status: app.status,
        notes: app.notes,
        appliedAt: app.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: mappedData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to fetch applicants' },
    });
  }
};

/**
 * PATCH /api/v1/admin/applicants/:id/status
 * Update an applicant's hiring status and notes
 * Handles atomic hiredCount $inc and auto-closing logic
 * (Protected: HR, ADMIN via 'applicant_tracking' write permission)
 */
export const updateApplicantStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status: newStatus, notes } = req.body;

    const validStatuses = ['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED'];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        },
      });
      return;
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
      return;
    }

    const previousStatus = application.status;

    // 1. Transitioning TO HIRED (and wasn't already HIRED): atomic $inc hiredCount
    if (newStatus === 'HIRED' && previousStatus !== 'HIRED') {
      const updatedVacancy = await JobVacancy.findOneAndUpdate(
        { _id: application.jobId, status: 'PUBLISHED' },
        { $inc: { hiredCount: 1 } },
        { new: true }
      );

      if (updatedVacancy && updatedVacancy.hiredCount >= updatedVacancy.openingsCount) {
        updatedVacancy.status = 'CLOSED';
        await updatedVacancy.save();
      }
    }

    // 2. Transitioning AWAY FROM HIRED to another status: decrement hiredCount (never below 0)
    if (previousStatus === 'HIRED' && newStatus !== 'HIRED') {
      await JobVacancy.findOneAndUpdate(
        { _id: application.jobId, hiredCount: { $gt: 0 } },
        { $inc: { hiredCount: -1 } }
      );
    }

    // 3. Update application record
    application.status = newStatus as 'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
    if (notes !== undefined) {
      application.notes = notes;
    }

    await application.save();

    const nameParts = [application.firstName, application.middleName, application.lastName].filter(Boolean);

    res.status(200).json({
      success: true,
      message: 'Applicant status updated successfully',
      data: {
        _id: application._id,
        jobId: application.jobId,
        jobTitle: application.jobTitle,
        name: nameParts.join(' '),
        email: application.email,
        passportNumber: application.passportNumber,
        status: application.status,
        notes: application.notes,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to update applicant status' },
    });
  }
};

/**
 * GET /api/v1/admin/applicants/:id/document/:docType
 * Stream candidate passport or resume file securely
 * (Protected: HR, ADMIN via 'applicant_tracking' read permission)
 */
export const getApplicantDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, docType } = req.params;

    if (docType !== 'passport' && docType !== 'resume') {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: "Invalid document type. Must be 'passport' or 'resume'.",
        },
      });
      return;
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
      return;
    }

    const docUrl = docType === 'passport' ? application.passportDocumentUrl : application.resumeUrl;
    if (!docUrl) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Requested document path is missing' },
      });
      return;
    }

    // Security & Path-Traversal Check
    const relativePath = docUrl.startsWith('/') ? docUrl.slice(1) : docUrl;
    const fullPath = path.resolve(__dirname, '../../', relativePath);
    const uploadsBase = path.resolve(__dirname, '../../uploads');

    if (!fullPath.startsWith(uploadsBase)) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied: invalid document file path' },
      });
      return;
    }

    if (!fs.existsSync(fullPath)) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document file not found on server storage' },
      });
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const filename = path.basename(fullPath);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(fullPath);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to retrieve applicant document' },
    });
  }
};
