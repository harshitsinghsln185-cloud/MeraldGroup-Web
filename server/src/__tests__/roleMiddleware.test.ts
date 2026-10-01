import { describe, it, expect, vi } from 'vitest';
import { checkModuleAccess, AuthenticatedRequest } from '../middleware/roleMiddleware';

describe('RBAC Middleware Enforcement (FIX 2)', () => {
  it('allows HR to access system_settings', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u1', email: 'hr@test.com', role: 'HR' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    const middleware = checkModuleAccess('system_settings', 'read');
    middleware(req as AuthenticatedRequest, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('blocks SITE_SUPERVISOR from system_settings with 403 Forbidden', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u2', email: 'supervisor@test.com', role: 'SITE_SUPERVISOR' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    const middleware = checkModuleAccess('system_settings', 'read');
    middleware(req as AuthenticatedRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'FORBIDDEN' }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks ADMIN from payroll_processing with 403 Forbidden', () => {
    const req: Partial<AuthenticatedRequest> = { user: { id: 'u3', email: 'admin@test.com', role: 'ADMIN' } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    const middleware = checkModuleAccess('payroll_processing', 'read');
    middleware(req as AuthenticatedRequest, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
