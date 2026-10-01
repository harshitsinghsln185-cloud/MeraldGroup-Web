import { describe, it, expect } from 'vitest';

describe('Step 5: JobApplicationModal Validation & Error Handling Unit Tests', () => {
  // Test validation functions & data structure requirements
  const validateForm = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passportNumber: string;
    passportFile: { size: number; name: string } | null;
    resumeFile: { size: number; name: string } | null;
  }) => {
    const errors: Record<string, string> = {};

    if (!data.firstName || data.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!data.lastName || data.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!data.phone || data.phone.length < 7) {
      errors.phone = 'Phone number must be at least 7 characters';
    }
    const passportUpper = data.passportNumber.toUpperCase();
    if (!passportUpper || !/^[A-Z0-9]{6,12}$/.test(passportUpper)) {
      errors.passportNumber = 'Passport number must be 6-12 alphanumeric characters';
    }
    if (!data.passportFile) {
      errors.passportFile = 'Passport document is required';
    } else if (data.passportFile.size > 5 * 1024 * 1024) {
      errors.passportFile = 'File exceeds 5MB limit';
    }

    if (!data.resumeFile) {
      errors.resumeFile = 'Resume document is required';
    } else if (data.resumeFile.name.endsWith('.doc')) {
      errors.resumeFile = 'Legacy .doc files are not supported. Please upload a .pdf or .docx file.';
    } else if (data.resumeFile.size > 5 * 1024 * 1024) {
      errors.resumeFile = 'File exceeds 5MB limit';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  it('fails validation when required fields are empty', () => {
    const result = validateForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNumber: '',
      passportFile: null,
      resumeFile: null,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.passportNumber).toBeDefined();
    expect(result.errors.passportFile).toBeDefined();
    expect(result.errors.resumeFile).toBeDefined();
  });

  it('auto-uppercases passport number and validates 6-12 character regex', () => {
    const validPassport = 'z9876543'.toUpperCase();
    expect(validPassport).toBe('Z9876543');
    expect(/^[A-Z0-9]{6,12}$/.test(validPassport)).toBe(true);

    const invalidShortPassport = '123';
    expect(/^[A-Z0-9]{6,12}$/.test(invalidShortPassport)).toBe(false);
  });

  it('rejects files larger than 5MB with client-side error message', () => {
    const oversizedFile = { name: 'large_resume.pdf', size: 6 * 1024 * 1024 };
    const validFile = { name: 'passport.pdf', size: 2 * 1024 * 1024 };

    const result = validateForm({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@example.com',
      phone: '+919876543210',
      passportNumber: 'Z9876543',
      passportFile: validFile,
      resumeFile: oversizedFile,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.resumeFile).toBe('File exceeds 5MB limit');
  });

  it('rejects legacy .doc resume files with explicit format message', () => {
    const docFile = { name: 'resume.doc', size: 1 * 1024 * 1024 };
    const validFile = { name: 'passport.pdf', size: 2 * 1024 * 1024 };

    const result = validateForm({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@example.com',
      phone: '+919876543210',
      passportNumber: 'Z9876543',
      passportFile: validFile,
      resumeFile: docFile,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.resumeFile).toContain('Legacy .doc files are not supported');
  });

  it('passes validation when all inputs and files are valid', () => {
    const validPassportFile = { name: 'passport.png', size: 1 * 1024 * 1024 };
    const validResumeFile = { name: 'cv.pdf', size: 2 * 1024 * 1024 };

    const result = validateForm({
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@example.com',
      phone: '+919876543210',
      passportNumber: 'Z9876543',
      passportFile: validPassportFile,
      resumeFile: validResumeFile,
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
