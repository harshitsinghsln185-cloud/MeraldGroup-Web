import { describe, it, expect } from 'vitest';
import { sanitizeEmployeeForRole } from '../controllers/employeeController';

describe('Employee Response Sanitizer (FIX 3)', () => {
  const dummyEmployee = {
    _id: 'emp123',
    fullName: 'Chidi Okonkwo',
    employeeCode: 'MGD-NIG-1001',
    basicSalary: 850000,
    bankName: 'First Bank',
    accountNumber: '0123456789',
    taxPin: 'NGN-TAX-123',
    department: 'MEP',
    designation: 'Senior Engineer',
  };

  it('keeps financial fields for HR role', () => {
    const sanitized = sanitizeEmployeeForRole(dummyEmployee, 'HR');
    expect(sanitized.basicSalary).toBe(850000);
    expect(sanitized.bankName).toBe('First Bank');
    expect(sanitized.accountNumber).toBe('0123456789');
    expect(sanitized.taxPin).toBe('NGN-TAX-123');
  });

  it('keeps financial fields for ACCOUNTS role', () => {
    const sanitized = sanitizeEmployeeForRole(dummyEmployee, 'ACCOUNTS');
    expect(sanitized.basicSalary).toBe(850000);
    expect(sanitized.bankName).toBe('First Bank');
  });

  it('strips financial fields for ADMIN role', () => {
    const sanitized = sanitizeEmployeeForRole(dummyEmployee, 'ADMIN');
    expect(sanitized.basicSalary).toBeUndefined();
    expect(sanitized.bankName).toBeUndefined();
    expect(sanitized.accountNumber).toBeUndefined();
    expect(sanitized.taxPin).toBeUndefined();
    expect(sanitized.fullName).toBe('Chidi Okonkwo');
  });

  it('strips financial fields for SITE_SUPERVISOR role', () => {
    const sanitized = sanitizeEmployeeForRole(dummyEmployee, 'SITE_SUPERVISOR');
    expect(sanitized.basicSalary).toBeUndefined();
    expect(sanitized.bankName).toBeUndefined();
    expect(sanitized.accountNumber).toBeUndefined();
    expect(sanitized.taxPin).toBeUndefined();
  });
});
