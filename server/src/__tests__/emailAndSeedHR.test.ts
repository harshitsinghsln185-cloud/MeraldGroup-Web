import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { getEmailConfig, validateEmailEnvStartup } from '../config/emailConfig';
import { seedHRAccount } from '../seeders/seedHR';

describe('Part 1 & Part 2: Email Transporter Config & HR Auto-Seeder Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Part 1: Email Environment Configuration & Fail-Fast Validation', () => {
    it('returns valid email configuration when all 7 env variables are set', () => {
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '465';
      process.env.SMTP_SECURE = 'true';
      process.env.SMTP_USER = 'test_user';
      process.env.SMTP_PASSWORD = 'test_password';
      process.env.EMAIL_FROM_NAME = 'Test HR';
      process.env.EMAIL_FROM_ADDRESS = 'hr@test.com';

      const config = getEmailConfig();

      expect(config.smtpHost).toBe('smtp.test.com');
      expect(config.smtpPort).toBe(465);
      expect(config.smtpSecure).toBe(true);
      expect(config.smtpUser).toBe('test_user');
      expect(config.smtpPassword).toBe('test_password');
      expect(config.emailFromName).toBe('Test HR');
      expect(config.emailFromAddress).toBe('hr@test.com');
    });

    it('fails fast with explicit error in non-development mode when required email env vars are missing', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.SMTP_HOST;
      delete process.env.SMTP_PORT;
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASSWORD;
      delete process.env.EMAIL_FROM_NAME;
      delete process.env.EMAIL_FROM_ADDRESS;

      expect(() => validateEmailEnvStartup()).toThrowError(
        /Missing or invalid required email environment variables in non-development mode/
      );
    });
  });

  describe('Part 2: HR Account Auto-Seeder (seedHR)', () => {
    it('skips HR creation with a warning if SEED_HR_EMAIL or SEED_HR_PASSWORD is missing', async () => {
      delete process.env.SEED_HR_EMAIL;
      delete process.env.SEED_HR_PASSWORD;

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await seedHRAccount();

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('SEED_HR_EMAIL or SEED_HR_PASSWORD environment variable is missing')
      );
    });

    it('creates exactly one active HR account with properly hashed password when env vars are set', async () => {
      process.env.SEED_HR_EMAIL = 'hr.test@meraldgroup.com';
      process.env.SEED_HR_PASSWORD = 'TestPassword123!';

      vi.spyOn(User, 'findOne').mockResolvedValue(null as any);

      let createdUserData: any = null;
      vi.spyOn(User, 'create').mockImplementation((data: any) => {
        createdUserData = data;
        return Promise.resolve(data as any);
      });

      const result = await seedHRAccount();

      expect(result).toBe(true);
      expect(createdUserData).not.toBeNull();
      expect(createdUserData.email).toBe('hr.test@meraldgroup.com');
      expect(createdUserData.role).toBe('HR');
      expect(createdUserData.isApproved).toBe(true);
      expect(createdUserData.approvalStatus).toBe('APPROVED');

      // Verify bcrypt password hash
      const isPasswordValid = await bcrypt.compare('TestPassword123!', createdUserData.password);
      expect(isPasswordValid).toBe(true);
    });

    it('prevents duplicate creation if HR user already exists (idempotency check)', async () => {
      process.env.SEED_HR_EMAIL = 'hr.test@meraldgroup.com';
      process.env.SEED_HR_PASSWORD = 'TestPassword123!';

      vi.spyOn(User, 'findOne').mockResolvedValue({ email: 'hr.test@meraldgroup.com' } as any);
      const createSpy = vi.spyOn(User, 'create');
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await seedHRAccount();

      expect(result).toBe(false);
      expect(createSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('HR account already exists, skipping');
    });
  });
});
