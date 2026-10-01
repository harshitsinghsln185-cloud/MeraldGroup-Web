import nodemailer from 'nodemailer';
import { getEmailConfig } from '../config/emailConfig';

const getTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });
};

const getFromAddress = () => {
  const config = getEmailConfig();
  return `"${config.emailFromName}" <${config.emailFromAddress}>`;
};

/**
 * Sends a branded Merald Group Welcome Email upon account creation
 */
export const sendWelcomeEmail = async (
  toEmail: string,
  fullName: string,
  temporaryPassword?: string
): Promise<boolean> => {
  try {
    const transporter = getTransporter();
    const loginUrl = process.env.CLIENT_URL || 'http://localhost:5173/admin/login';

    const htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0D2E45 0%, #1D6FA5 45%, #3D9DA0 75%, #83C9B8 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: 'Poppins', sans-serif;">Merald Group</h1>
          <p style="color: #E4F5EE; margin-top: 4px; font-size: 13px;">Engineering Excellence, Global Infrastructure</p>
        </div>
        
        <div style="padding: 32px;">
          <h2 style="color: #0D2E45; font-size: 20px; margin-top: 0;">Welcome to Merald Portal, ${fullName}!</h2>
          <p style="color: #1A1F24; font-size: 15px; line-height: 1.6;">
            Your account has been provisioned on the Merald Group Portal. You can now access employee services, attendance logs, and corporate operational tools.
          </p>

          ${
            temporaryPassword
              ? `<div style="background: #F7F9FA; border-left: 4px solid #3D9DA0; padding: 16px; margin: 24px 0;">
                  <p style="margin: 0; color: #6B7280; font-size: 13px;">Your Temporary Password:</p>
                  <p style="margin: 4px 0 0 0; color: #0D2E45; font-size: 18px; font-weight: bold; font-family: monospace;">${temporaryPassword}</p>
                </div>`
              : ''
          }

          <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="background: #14476B; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; display: inline-block;">
              Login to Portal
            </a>
          </div>

          <p style="color: #6B7280; font-size: 13px; margin-bottom: 0;">
            If you did not request this account, please contact the Merald HR department immediately.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: getFromAddress(),
      to: toEmail,
      subject: 'Welcome to Merald Group Enterprise Portal',
      html: htmlContent,
    });

    console.log(`[EmailService] Welcome email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending welcome email:', error);
    return false;
  }
};

/**
 * Sends a 6-digit OTP verification email for Forgot Password recovery
 */
export const sendOTPEmail = async (toEmail: string, otpCode: string): Promise<boolean> => {
  try {
    const transporter = getTransporter();

    const htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0D2E45; padding: 20px; text-align: center;">
          <h2 style="color: #83C9B8; margin: 0; font-size: 22px;">Merald Group Security</h2>
        </div>
        
        <div style="padding: 28px; text-align: center;">
          <h3 style="color: #0D2E45; margin-top: 0;">Password Reset Verification OTP</h3>
          <p style="color: #6B7280; font-size: 14px; line-height: 1.5;">
            Use the 6-digit numeric OTP code below to verify your identity and reset your password. This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <div style="background: #E4F5EE; border: 2px dashed #3D9DA0; padding: 16px; border-radius: 8px; margin: 24px 0; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0D2E45; font-family: monospace;">${otpCode}</span>
          </div>

          <p style="color: #D64545; font-size: 12px; margin-bottom: 0;">
            Never share this OTP with anyone. Merald IT Support will never ask for your OTP.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: getFromAddress(),
      to: toEmail,
      subject: 'Merald Group Password Reset OTP Code',
      html: htmlContent,
    });

    console.log(`[EmailService] Password Reset OTP sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending OTP email:', error);
    return false;
  }
};

/**
 * Sends a branded HTML confirmation email upon successful Job Application submission
 */
export const sendApplicationConfirmationEmail = async (
  toEmail: string,
  candidateName: string,
  jobTitle: string
): Promise<boolean> => {
  try {
    const transporter = getTransporter();

    const htmlContent = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0D2E45 0%, #1D6FA5 45%, #3D9DA0 75%, #83C9B8 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-family: 'Poppins', sans-serif;">Merald Group</h1>
          <p style="color: #E4F5EE; margin-top: 4px; font-size: 13px;">Career Portal & Candidate Tracking</p>
        </div>
        
        <div style="padding: 32px;">
          <h2 style="color: #0D2E45; font-size: 20px; margin-top: 0;">Application Received!</h2>
          <p style="color: #1A1F24; font-size: 15px; line-height: 1.6;">
            Dear ${candidateName},
          </p>
          <p style="color: #1A1F24; font-size: 15px; line-height: 1.6;">
            Thank you for applying for the position of <strong>${jobTitle}</strong> at Merald Group. We have successfully received your candidate profile and documents.
          </p>
          
          <div style="background: #F7F9FA; border-left: 4px solid #3D9DA0; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #0D2E45; font-size: 14px; font-weight: bold;">Next Steps in Our Recruitment Process:</p>
            <ol style="margin: 8px 0 0 18px; padding: 0; color: #6B7280; font-size: 13px; line-height: 1.5;">
              <li>Application review by our engineering HR team</li>
              <li>Technical & HSE assessment interview</li>
              <li>Final leadership deployment alignment</li>
            </ol>
          </div>

          <p style="color: #6B7280; font-size: 13px;">
            Our HR team will reach out to you if your qualifications match our active deployment requirements.
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: getFromAddress(),
      to: toEmail,
      subject: `Application Confirmation - ${jobTitle} | Merald Group`,
      html: htmlContent,
    });

    console.log(`[EmailService] Application confirmation email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending application confirmation email:', error);
    return false;
  }
};

