import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getCountries, getCountryBySlug } from '../controllers/countryController';
import { getPublicJobs, applyForJob } from '../controllers/jobController';
import { submitContactInquiry } from '../controllers/inquiryController';

const router = Router();

// Ensure upload directory exists for resumes
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for PDF/Doc resume uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
});

// Country Endpoints
router.get('/countries', getCountries);
router.get('/countries/:slug', getCountryBySlug);

// Job Endpoints
router.get('/jobs', getPublicJobs);
router.post('/jobs/apply', upload.single('resume'), applyForJob);

// Contact Inquiry Endpoints
router.post('/inquiries', submitContactInquiry);

export default router;
