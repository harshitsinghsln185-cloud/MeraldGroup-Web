import { Request, Response } from 'express';
import Country from '../models/Country';

export const getCountries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const countries = await Country.find().select('name slug flag capital currency stats localOffice');
    res.status(200).json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch country listing' },
    });
  }
};

export const getCountryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const country = await Country.findOne({ slug: slug.toLowerCase() });

    if (!country) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: `Country with slug '${slug}' not found` },
      });
      return;
    }

    res.status(200).json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch country details' },
    });
  }
};
