import dotenv from 'dotenv';
dotenv.config();

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  emailFromName: string;
  emailFromAddress: string;
}

export const getEmailConfig = (): EmailConfig => {
  const smtpHost = process.env.SMTP_HOST;
  const rawPort = process.env.SMTP_PORT;
  const smtpPort = rawPort ? parseInt(rawPort, 10) : NaN;
  const rawSecure = process.env.SMTP_SECURE;
  const smtpSecure = rawSecure === 'true';
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const emailFromName = process.env.EMAIL_FROM_NAME;
  const emailFromAddress = process.env.EMAIL_FROM_ADDRESS;

  const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

  const missing: string[] = [];
  if (!smtpHost) missing.push('SMTP_HOST');
  if (!rawPort || isNaN(smtpPort)) missing.push('SMTP_PORT');
  if (rawSecure === undefined || rawSecure === '') missing.push('SMTP_SECURE');
  if (!smtpUser) missing.push('SMTP_USER');
  if (!smtpPassword) missing.push('SMTP_PASSWORD');
  if (!emailFromName) missing.push('EMAIL_FROM_NAME');
  if (!emailFromAddress) missing.push('EMAIL_FROM_ADDRESS');

  if (missing.length > 0 && !isDevOrTest) {
    throw new Error(
      `[EmailConfig Error] Missing or invalid required email environment variables in non-development mode: ${missing.join(', ')}`
    );
  }

  return {
    smtpHost: smtpHost || 'smtp.ethereal.email',
    smtpPort: !isNaN(smtpPort) ? smtpPort : 587,
    smtpSecure,
    smtpUser: smtpUser || '',
    smtpPassword: smtpPassword || '',
    emailFromName: emailFromName || 'Merald Group HR',
    emailFromAddress: emailFromAddress || 'no-reply@meraldgroup.com',
  };
};

export const validateEmailEnvStartup = (): void => {
  const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  if (!isDevOrTest) {
    getEmailConfig();
  }
};
