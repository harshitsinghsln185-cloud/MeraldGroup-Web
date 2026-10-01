import { Request, Response } from 'express';
import ContactInquiry from '../models/ContactInquiry';

export const submitContactInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { inquiryType, fullName, companyName, email, phone, targetCountry, serviceCategory, message } = req.body;

    if (!inquiryType || !fullName || !companyName || !email || !phone || !targetCountry || !serviceCategory || !message) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All form fields are required' },
      });
      return;
    }

    const inquiry = await ContactInquiry.create({
      inquiryType,
      fullName,
      companyName,
      email,
      phone,
      targetCountry,
      serviceCategory,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our regional team will contact you shortly.',
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to submit inquiry form' },
    });
  }
};
