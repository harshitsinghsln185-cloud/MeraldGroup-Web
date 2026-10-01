import { describe, it, expect, vi } from 'vitest';
import { login } from '../controllers/authController';

describe('Mandatory Role-Based Login Validation', () => {
  it('rejects login with 400 Bad Request when role is missing', async () => {
    const req: any = {
      body: { email: 'admin@meraldgroup.com', password: 'Password123!' },
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Email, password, and a valid access role (HR, ACCOUNTS, ADMIN, SITE_SUPERVISOR) are required',
      },
    });
  });

  it('rejects login with 400 Bad Request when role is invalid', async () => {
    const req: any = {
      body: { email: 'admin@meraldgroup.com', password: 'Password123!', role: 'SUPER_ADMIN' },
    };
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Email, password, and a valid access role (HR, ACCOUNTS, ADMIN, SITE_SUPERVISOR) are required',
      },
    });
  });
});
