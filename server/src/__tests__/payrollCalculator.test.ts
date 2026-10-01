import { describe, it, expect } from 'vitest';
import { calculatePayrollDetails } from '../controllers/payrollController';

describe('Payroll Calculation Precision (FIX 8)', () => {
  it('computes exact Gross, Tax, Pension, and Net Salary without float precision errors', () => {
    const res = calculatePayrollDetails(850000, 300000, 150000, 50000, 0.1, 0.05);

    expect(res.grossSalary).toBe(1350000);
    expect(res.taxDeduction).toBe(135000);
    expect(res.pensionDeduction).toBe(42500);
    expect(res.totalDeductions).toBe(177500);
    expect(res.netSalary).toBe(1172500);
  });

  it('handles zero allowances and custom decimals cleanly', () => {
    const res = calculatePayrollDetails(65000.5, 0, 0, 0, 0.1, 0.05);
    expect(res.grossSalary).toBe(65000.5);
    expect(res.taxDeduction).toBe(6500.05);
    expect(res.pensionDeduction).toBe(3250.03);
  });
});
