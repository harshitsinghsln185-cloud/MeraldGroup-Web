import { Request, Response } from 'express';
import Manpower from '../models/Manpower';

// GET /api/v1/admin/manpower (List manpower analytics & shortfall matrix)
export const getManpowerAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, site } = req.query;
    const query: Record<string, unknown> = {};

    if (country) query.country = country;
    if (site) query.siteName = site;

    const items = await Manpower.find(query).sort({ shortfall: -1 });

    // Aggregate overall metrics
    let totalContracted = 0;
    let totalDeployed = 0;

    items.forEach((item) => {
      totalContracted += item.contractedHeadcount;
      totalDeployed += item.actualDeployedHeadcount;
    });

    const totalShortfall = Math.max(0, totalContracted - totalDeployed);
    const overallFulfillment = totalContracted > 0 ? Math.round((totalDeployed / totalContracted) * 100) : 100;

    res.json({
      success: true,
      data: items,
      metrics: {
        totalContracted,
        totalDeployed,
        totalShortfall,
        overallFulfillment,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch manpower supply analytics.' });
  }
};
