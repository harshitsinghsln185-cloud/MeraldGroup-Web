import { z } from 'zod';

export const salaryPackageSchema = z.object({
  amount: z.number().positive('Salary amount must be positive'),
  currency: z.enum(['INR', 'NGN'], { message: 'Currency must be either INR or NGN' }),
});

export const recruitmentStepSchema = z.object({
  stepNumber: z.number().int().positive('Step number must be positive'),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().min(1, 'Step description is required'),
});

export const createJobVacancySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  department: z.string().min(2, 'Department is required'),
  salaryPackage: salaryPackageSchema,
  location: z.enum(['India', 'UAE', 'Uganda', 'Nigeria', 'Ghana'], {
    message: 'Invalid location',
  }),
  experienceRequired: z.string().min(1, 'Experience required is required'),
  ageRequirement: z.string().min(1, 'Age requirement is required'),
  facilitiesProvided: z
    .array(z.string())
    .min(1, 'At least one facility must be provided'),
  recruitmentProcess: z
    .array(recruitmentStepSchema)
    .min(1, 'At least one recruitment process step is required'),
  degreeRequired: z.string().min(2, 'Degree required is required'),
  skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
  documentsRequired: z.array(z.string()).min(1, 'At least one document is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional().default('DRAFT'),
  openingsCount: z
    .number()
    .int()
    .positive('Openings count must be at least 1')
    .optional()
    .default(1),
  hiredCount: z
    .number()
    .int()
    .min(0, 'Hired count cannot be negative')
    .optional()
    .default(0),
  postedDate: z.coerce.date().optional(),
  closingDate: z.coerce.date().optional(),
});

export type CreateJobVacancyInput = z.infer<typeof createJobVacancySchema>;
