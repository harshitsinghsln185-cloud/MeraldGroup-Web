import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import JobVacancy from '../models/JobVacancy';
import JobApplication from '../models/JobApplication';
import { createJobApplicationSchema } from '../validators/jobApplicationValidator';
import { verifyFileSignature } from '../utils/fileSignature';
import { sendApplicationConfirmationEmail } from '../services/emailService';

/**
 * POST /api/v1/jobs/apply
 * Public Job Application Submission Handler
 */
export const submitJobApplication = async (req: Request, res: Response): Promise<void> => {
  let passportPath: string | null = null;
  let resumePath: string | null = null;

  try {
    // 1. Parse nested FormData text values
    let parsedPreviousCTC = req.body.previousCTC;
    if (typeof req.body.previousCTC === 'string') {
      try {
        parsedPreviousCTC = JSON.parse(req.body.previousCTC);
      } catch {
        // Fallthrough to validator
      }
    }

    const bodyData = {
      ...req.body,
      experienceYears: req.body.experienceYears !== undefined ? Number(req.body.experienceYears) : undefined,
      previousCTC: parsedPreviousCTC,
    };

    // 2. Validate body with Zod schema
    const parseResult = createJobApplicationSchema.safeParse(bodyData);
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

    const data = parseResult.data;

    // 3. Confirm vacancy is published & active
    const vacancy = await JobVacancy.findById(data.jobId);
    const now = new Date();

    if (
      !vacancy ||
      vacancy.status !== 'PUBLISHED' ||
      (vacancy.closingDate && vacancy.closingDate <= now) ||
      vacancy.hiredCount >= vacancy.openingsCount
    ) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'This position is no longer accepting applications.',
        },
      });
      return;
    }

    // 4. Verify file presence
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const passportFile = files?.passportFile?.[0];
    const resumeFile = files?.resumeFile?.[0];

    if (!passportFile || !resumeFile) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Both passport document and resume file are required.',
        },
      });
      return;
    }

    // 5. Magic-byte signature verification
    const isPassportValid = verifyFileSignature(
      passportFile.buffer,
      'passport',
      passportFile.originalname
    );
    const isResumeValid = verifyFileSignature(
      resumeFile.buffer,
      'resume',
      resumeFile.originalname
    );

    if (!isPassportValid || !isResumeValid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_SIGNATURE',
          message: 'Invalid file signature. File content does not match extension.',
        },
      });
      return;
    }

    // 6. Save files to secure upload directories
    const passportsDir = path.join(__dirname, '../../uploads/applications/passports');
    const resumesDir = path.join(__dirname, '../../uploads/applications/resumes');

    if (!fs.existsSync(passportsDir)) fs.mkdirSync(passportsDir, { recursive: true });
    if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });

    const passportExt = path.extname(passportFile.originalname).toLowerCase();
    const resumeExt = path.extname(resumeFile.originalname).toLowerCase();

    const passportFilename = `pass_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${passportExt}`;
    const resumeFilename = `res_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${resumeExt}`;

    passportPath = path.join(passportsDir, passportFilename);
    resumePath = path.join(resumesDir, resumeFilename);

    fs.writeFileSync(passportPath, passportFile.buffer);
    fs.writeFileSync(resumePath, resumeFile.buffer);

    const passportDocumentUrl = `/uploads/applications/passports/${passportFilename}`;
    const resumeUrl = `/uploads/applications/resumes/${resumeFilename}`;

    // 7. Create JobApplication document
    const newApplication = new JobApplication({
      ...data,
      jobTitle: vacancy.title,
      passportDocumentUrl,
      resumeUrl,
      status: 'NEW',
    });

    try {
      await newApplication.save();
    } catch (err: any) {
      // Clean up disk files on DB error
      if (passportPath && fs.existsSync(passportPath)) fs.unlinkSync(passportPath);
      if (resumePath && fs.existsSync(resumePath)) fs.unlinkSync(resumePath);

      if (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_APPLICATION',
            message: `You have already submitted an application for this vacancy with passport number ${data.passportNumber}.`,
          },
        });
        return;
      }
      throw err;
    }

    // 8. Resilient confirmation email dispatch
    try {
      await sendApplicationConfirmationEmail(
        data.email,
        `${data.firstName} ${data.lastName}`,
        vacancy.title
      );
    } catch (emailErr) {
      console.error('[JobApplicationController] Confirmation email failed silently:', emailErr);
    }

    // 9. Return success response with created application ID
    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully!',
      data: { id: newApplication._id },
    });
  } catch (error: any) {
    // Cleanup any saved files on unhandled error
    if (passportPath && fs.existsSync(passportPath)) fs.unlinkSync(passportPath);
    if (resumePath && fs.existsSync(resumePath)) fs.unlinkSync(resumePath);

    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message || 'Failed to submit job application' },
    });
  }
};
