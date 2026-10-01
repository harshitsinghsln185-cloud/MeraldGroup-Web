import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { getCountries, getCountryBySlug } from '../controllers/countryController';
import { getPublicVacancies, getVacancyById } from '../controllers/jobController';
import { submitJobApplication } from '../controllers/jobApplicationController';
import { submitContactInquiry } from '../controllers/inquiryController';

const router = Router();

// Memory storage for Job Applications to inspect magic-byte signatures
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

const applyMulterFields = uploadMemory.fields([
  { name: 'passportFile', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 },
]);

// Wrapper middleware to return standard error JSON on Multer errors (e.g. file size exceeded)
const handleApplicationUpload = (req: Request, res: Response, next: NextFunction): void => {
  applyMulterFields(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: err.message || 'File size limit exceeded (Max 5MB per file)',
        },
      });
      return;
    }
    if (err) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: err.message || 'Error uploading candidate files',
        },
      });
      return;
    }
    next();
  });
};

// Rate limiter attached strictly to POST /api/v1/jobs/apply (5 requests per hour per IP)
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many application submissions from this IP address, please try again in an hour.',
    },
  },
});

// Country Endpoints
router.get('/countries', getCountries);
router.get('/countries/:slug', getCountryBySlug);

// Job Vacancy Endpoints (Public)
router.get('/vacancies', getPublicVacancies);
router.get('/vacancies/:id', getVacancyById);
router.get('/jobs', getPublicVacancies);

// Public Job Application Submission
router.post('/jobs/apply', applyLimiter, handleApplicationUpload, submitJobApplication);

// Contact Inquiry Endpoints
router.post('/inquiries', submitContactInquiry);

export default router;
