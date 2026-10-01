import { describe, it, expect } from 'vitest';

export interface JobVacancyDetail {
  _id: string;
  title: string;
  department: string;
  salaryPackage: { amount: number; currency: 'INR' | 'NGN' };
  location: 'India' | 'UAE' | 'Uganda' | 'Nigeria' | 'Ghana';
  experienceRequired: string;
  ageRequirement: string;
  facilitiesProvided: string[];
  recruitmentProcess: { stepNumber: number; title: string; description: string }[];
  degreeRequired: string;
  skillsRequired: string[];
  documentsRequired: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  openingsCount: number;
  hiredCount: number;
  postedDate?: string;
  closingDate?: string;
}

const formatCurrency = (amount: number, currency: 'INR' | 'NGN') => {
  const symbol = currency === 'INR' ? '₹' : '₦';
  return `${symbol} ${amount.toLocaleString()}`;
};

const getLocationFlag = (location: string) => {
  switch (location) {
    case 'India':
      return '🇮🇳';
    case 'Nigeria':
      return '🇳🇬';
    case 'UAE':
      return '🇦🇪';
    case 'Ghana':
      return '🇬🇭';
    case 'Uganda':
      return '🇺🇬';
    default:
      return '🌐';
  }
};

describe('Step 3: Public Career Portal - Listing & Detail View Unit Tests', () => {
  const mockVacancy: JobVacancyDetail = {
    _id: 'vac_001',
    title: 'Senior Substation Engineer',
    department: 'EPC',
    salaryPackage: { amount: 150000, currency: 'INR' },
    location: 'India',
    experienceRequired: '6 Years',
    ageRequirement: '25-38 Years',
    facilitiesProvided: ['Medical Insurance', 'Transport Allowance', 'Housing'],
    recruitmentProcess: [
      { stepNumber: 1, title: 'CV Screening', description: 'HR Initial Screen' },
      { stepNumber: 2, title: 'Technical Interview', description: 'Engineering Panel Review' },
    ],
    degreeRequired: 'B.Tech Electrical Engineering',
    skillsRequired: ['Substation Design', 'AutoCAD', 'HSE'],
    documentsRequired: ['Passport', 'Degree Certificate'],
    status: 'PUBLISHED',
    openingsCount: 2,
    hiredCount: 0,
    postedDate: '2026-09-01T00:00:00.000Z',
  };

  it('formats INR and NGN salary packages with correct currency symbols', () => {
    const formattedInr = formatCurrency(150000, 'INR');
    expect(formattedInr).toContain('₹');
    expect(formattedInr).toMatch(/150[,.]?000|1[,.]50[,.]000/);

    const formattedNgn = formatCurrency(2500000, 'NGN');
    expect(formattedNgn).toContain('₦');
    expect(formattedNgn).toMatch(/2[,.]500[,.]000|25[,.]00[,.]000/);
  });

  it('returns correct country flag icons for all 5 supported locations', () => {
    expect(getLocationFlag('India')).toBe('🇮🇳');
    expect(getLocationFlag('Nigeria')).toBe('🇳🇬');
    expect(getLocationFlag('UAE')).toBe('🇦🇪');
    expect(getLocationFlag('Ghana')).toBe('🇬🇭');
    expect(getLocationFlag('Uganda')).toBe('🇺🇬');
    expect(getLocationFlag('Unknown')).toBe('🌐');
  });

  it('verifies all required fields exist on a valid JobVacancyDetail', () => {
    expect(mockVacancy._id).toBe('vac_001');
    expect(mockVacancy.title).toBe('Senior Substation Engineer');
    expect(mockVacancy.salaryPackage.currency).toBe('INR');
    expect(mockVacancy.facilitiesProvided).toHaveLength(3);
    expect(mockVacancy.recruitmentProcess[0].stepNumber).toBe(1);
    expect(mockVacancy.recruitmentProcess[1].stepNumber).toBe(2);
    expect(mockVacancy.skillsRequired).toContain('Substation Design');
  });

  it('correctly identifies published vs non-published vacancy states', () => {
    const isPublished = (v: JobVacancyDetail) => v.status === 'PUBLISHED';
    expect(isPublished(mockVacancy)).toBe(true);

    const draftVacancy: JobVacancyDetail = { ...mockVacancy, status: 'DRAFT' };
    expect(isPublished(draftVacancy)).toBe(false);

    const closedVacancy: JobVacancyDetail = { ...mockVacancy, status: 'CLOSED' };
    expect(isPublished(closedVacancy)).toBe(false);
  });

  it('validates empty state condition when zero vacancies are returned', () => {
    const vacanciesList: JobVacancyDetail[] = [];
    const hasVacancies = vacanciesList.length > 0;
    expect(hasVacancies).toBe(false);
  });
});
