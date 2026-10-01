import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';
import JobVacancy from '../models/JobVacancy';
import JobApplication from '../models/JobApplication';
import { createJobVacancySchema } from '../validators/jobVacancyValidator';
import { createJobApplicationSchema } from '../validators/jobApplicationValidator';
import { checkModuleAccess, AuthenticatedRequest } from '../middleware/roleMiddleware';

describe('Step 1: RBAC Permission Key - applicant_tracking', () => {
  it('allows HR full access (read & write)', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u1', email: 'hr@test.com', role: 'HR' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const nextRead = vi.fn();
    const nextWrite = vi.fn();

    checkModuleAccess('applicant_tracking', 'read')(req as AuthenticatedRequest, res, nextRead);
    expect(nextRead).toHaveBeenCalled();

    checkModuleAccess('applicant_tracking', 'write')(req as AuthenticatedRequest, res, nextWrite);
    expect(nextWrite).toHaveBeenCalled();
  });

  it('allows ADMIN full access (read & write)', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u2', email: 'admin@test.com', role: 'ADMIN' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const nextRead = vi.fn();
    const nextWrite = vi.fn();

    checkModuleAccess('applicant_tracking', 'read')(req as AuthenticatedRequest, res, nextRead);
    expect(nextRead).toHaveBeenCalled();

    checkModuleAccess('applicant_tracking', 'write')(req as AuthenticatedRequest, res, nextWrite);
    expect(nextWrite).toHaveBeenCalled();
  });

  it('denies ACCOUNTS access with 403 FORBIDDEN', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u3', email: 'accounts@test.com', role: 'ACCOUNTS' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    checkModuleAccess('applicant_tracking', 'read')(req as AuthenticatedRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('denies SITE_SUPERVISOR access with 403 FORBIDDEN', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u4', email: 'supervisor@test.com', role: 'SITE_SUPERVISOR' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    checkModuleAccess('applicant_tracking', 'read')(req as AuthenticatedRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Step 1: JobVacancy Mongoose Model', () => {
  it('applies default values correctly', () => {
    const vacancy = new JobVacancy({});
    expect(vacancy.status).toBe('DRAFT');
    expect(vacancy.openingsCount).toBe(1);
    expect(vacancy.hiredCount).toBe(0);
  });

  it('fails validation when required fields are missing', () => {
    const vacancy = new JobVacancy({});
    const err = vacancy.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['title']).toBeDefined();
    expect(err?.errors['department']).toBeDefined();
    expect(err?.errors['location']).toBeDefined();
    expect(err?.errors['salaryPackage']).toBeDefined();
    expect(err?.errors['experienceRequired']).toBeDefined();
    expect(err?.errors['ageRequirement']).toBeDefined();
    expect(err?.errors['degreeRequired']).toBeDefined();
    expect(err?.errors['createdBy']).toBeDefined();
  });

  it('rejects invalid location enum', () => {
    const vacancy = new JobVacancy({
      title: 'Senior Engineer',
      department: 'MEP',
      salaryPackage: { amount: 50000, currency: 'INR' },
      location: 'UK', // Invalid location
      experienceRequired: '5 Years',
      ageRequirement: '25-35',
      facilitiesProvided: ['Transport'],
      recruitmentProcess: [{ stepNumber: 1, title: 'Screening', description: 'Initial HR screen' }],
      degreeRequired: 'B.Tech',
      skillsRequired: ['AutoCAD'],
      documentsRequired: ['Passport'],
      createdBy: new mongoose.Types.ObjectId(),
    });
    const err = vacancy.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['location']).toBeDefined();
  });

  it('rejects invalid currency in salaryPackage', () => {
    const vacancy = new JobVacancy({
      title: 'Senior Engineer',
      department: 'MEP',
      salaryPackage: { amount: 50000, currency: 'USD' }, // Invalid currency
      location: 'India',
      experienceRequired: '5 Years',
      ageRequirement: '25-35',
      facilitiesProvided: ['Transport'],
      recruitmentProcess: [{ stepNumber: 1, title: 'Screening', description: 'Initial HR screen' }],
      degreeRequired: 'B.Tech',
      skillsRequired: ['AutoCAD'],
      documentsRequired: ['Passport'],
      createdBy: new mongoose.Types.ObjectId(),
    });
    const err = vacancy.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['salaryPackage.currency']).toBeDefined();
  });
});

describe('Step 1: JobApplication Mongoose Model', () => {
  it('applies default status value correctly', () => {
    const app = new JobApplication({});
    expect(app.status).toBe('NEW');
  });

  it('fails validation when required fields are missing', () => {
    const app = new JobApplication({});
    const err = app.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['jobId']).toBeDefined();
    expect(err?.errors['firstName']).toBeDefined();
    expect(err?.errors['lastName']).toBeDefined();
    expect(err?.errors['passportNumber']).toBeDefined();
    expect(err?.errors['email']).toBeDefined();
    expect(err?.errors['resumeUrl']).toBeDefined();
    expect(err?.errors['passportDocumentUrl']).toBeDefined();
  });

  it('rejects invalid status enum', () => {
    const app = new JobApplication({
      jobId: new mongoose.Types.ObjectId(),
      jobTitle: 'Senior Engineer',
      firstName: 'John',
      lastName: 'Doe',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      passportNumber: 'A1234567',
      experienceYears: 4,
      email: 'john@example.com',
      phone: '+919876543210',
      passportDocumentUrl: '/uploads/passports/pass1.pdf',
      previousCompany: 'ABC Corp',
      previousRole: 'Engineer',
      previousCTC: { amount: 40000, currency: 'INR' },
      resumeUrl: '/uploads/resumes/res1.pdf',
      status: 'ACCEPTED', // Invalid enum
    });
    const err = app.validateSync();
    expect(err).toBeDefined();
    expect(err?.errors['status']).toBeDefined();
  });
});

describe('Step 1: Zod jobVacancyValidator', () => {
  const validVacancyInput = {
    title: 'Project Manager',
    department: 'Operations',
    salaryPackage: { amount: 120000, currency: 'NGN' },
    location: 'Nigeria',
    experienceRequired: '7+ Years',
    ageRequirement: '28-40 Years',
    facilitiesProvided: ['Housing', 'Flight Ticket'],
    recruitmentProcess: [{ stepNumber: 1, title: 'Interview', description: 'Technical round' }],
    degreeRequired: 'B.Sc Engineering',
    skillsRequired: ['PMP', 'Site Operations'],
    documentsRequired: ['Passport', 'Degree Certificate'],
    openingsCount: 2,
  };

  it('passes valid vacancy input', () => {
    const result = createJobVacancySchema.safeParse(validVacancyInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('DRAFT');
      expect(result.data.hiredCount).toBe(0);
    }
  });

  it('fails when required fields are missing', () => {
    const result = createJobVacancySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects currency other than INR/NGN in salaryPackage', () => {
    const invalidInput = {
      ...validVacancyInput,
      salaryPackage: { amount: 1000, currency: 'USD' },
    };
    const result = createJobVacancySchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('rejects invalid location', () => {
    const invalidInput = {
      ...validVacancyInput,
      location: 'Germany',
    };
    const result = createJobVacancySchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe('Step 1: Zod jobApplicationValidator', () => {
  const validApplicationInput = {
    jobId: '60d5ecb8b5c9c2415c8e3112',
    firstName: 'Jane',
    lastName: 'Smith',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    passportNumber: '  k9876543  ',
    experienceYears: 5,
    email: ' JANE.SMITH@EXAMPLE.COM ',
    phone: '+919988776655',
    previousCompany: 'Tech Ltd',
    previousRole: 'Lead Engineer',
    previousCTC: { amount: 800000, currency: 'INR' },
  };

  it('passes valid application input and transforms passportNumber & email correctly', () => {
    const result = createJobApplicationSchema.safeParse(validApplicationInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passportNumber).toBe('K9876543');
      expect(result.data.email).toBe('jane.smith@example.com');
    }
  });

  it('fails when required fields are missing', () => {
    const result = createJobApplicationSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects invalid passportNumber format', () => {
    const invalidInput = {
      ...validApplicationInput,
      passportNumber: '123', // Too short (must be 6-12 alphanumeric)
    };
    const result = createJobApplicationSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('rejects currency other than INR/NGN in previousCTC', () => {
    const invalidInput = {
      ...validApplicationInput,
      previousCTC: { amount: 5000, currency: 'EUR' },
    };
    const result = createJobApplicationSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
