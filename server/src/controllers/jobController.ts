import { Request, Response } from 'express';
import Job from '../models/Job';
import JobApplication from '../models/JobApplication';

export const getPublicJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, department } = req.query;
    const filter: Record<string, unknown> = { isActive: true };

    if (country) filter.country = country;
    if (department) filter.department = department;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch job openings' },
    });
  }
};

export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, fullName, email, phone, country, experienceYears } = req.body;
    const resumeFile = req.file;

    if (!fullName || !email || !phone || !country || !experienceYears) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All required application fields must be provided' },
      });
      return;
    }

    const resumeUrl = resumeFile ? `/uploads/resumes/${resumeFile.filename}` : '/uploads/resumes/sample_resume.pdf';

    const newApplication = await JobApplication.create({
      jobId: jobId || undefined,
      fullName,
      email,
      phone,
      country,
      experienceYears: Number(experienceYears),
      resumeUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully!',
      data: newApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to submit job application' },
    });
  }
};
