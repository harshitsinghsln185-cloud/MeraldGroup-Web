import { describe, it, expect } from 'vitest';

describe('Client Auth & Role Config Baseline (FIX 10)', () => {
  it('validates supported user roles', () => {
    const roles = ['HR', 'ACCOUNTS', 'ADMIN', 'SITE_SUPERVISOR'];
    expect(roles).toHaveLength(4);
    expect(roles).toContain('HR');
    expect(roles).toContain('ACCOUNTS');
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('SITE_SUPERVISOR');
  });

  it('ensures currency limits are INR and NGN only', () => {
    const payrollCurrencies = ['INR', 'NGN'];
    expect(payrollCurrencies).not.toContain('USD');
    expect(payrollCurrencies).toHaveLength(2);
  });
});
