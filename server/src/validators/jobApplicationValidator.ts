import { z } from 'zod';

export const previousCTCSchema = z.object({
  amount: z.number().min(0, 'Previous CTC amount cannot be negative'),
  currency: z.enum(['INR', 'NGN'], { message: 'Currency must be either INR or NGN' }),
});

export const createJobApplicationSchema = z.object({
  jobId: z.string().min(24, 'Invalid Job ID format'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  passportNumber: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase())
    .pipe(
      z.string().regex(/^[A-Z0-9]{6,12}$/, 'Invalid passport number format')
    ),
  experienceYears: z.number().min(0, 'Experience years cannot be negative'),
  email: z.string().trim().toLowerCase().email('Invalid email address format'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  whatsAppNumber: z.string().optional(),
  previousCompany: z.string().min(2, 'Previous company is required'),
  previousRole: z.string().min(2, 'Previous role is required'),
  previousCTC: previousCTCSchema,
});

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;
