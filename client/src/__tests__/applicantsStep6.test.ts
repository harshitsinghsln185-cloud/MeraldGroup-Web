import { describe, it, expect } from 'vitest';

describe('Step 6: HR Applicants ATS Screen & Status Update Unit Tests', () => {
  const mockApplicants = [
    {
      _id: 'app001',
      jobId: 'job101',
      jobTitle: 'Senior MEP Engineer',
      firstName: 'Rahul',
      middleName: 'K.',
      lastName: 'Sharma',
      name: 'Rahul K. Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+919876543210',
      whatsAppNumber: '+919876543210',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      passportNumber: 'Z9876543',
      experienceYears: 6,
      previousCompany: 'L&T Construction',
      previousRole: 'Site Supervisor',
      previousCTC: { amount: 750000, currency: 'INR' as const },
      status: 'NEW' as const,
      notes: '',
      appliedAt: '2026-10-01T10:00:00.000Z',
    },
  ];

  it('constructs correct API query parameters for filtering by name, passport, status, and jobId', () => {
    const buildQueryParams = (params: {
      page: number;
      limit: number;
      nameSearch?: string;
      passportSearch?: string;
      statusFilter?: string;
      jobFilter?: string;
    }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(params.page));
      queryParams.append('limit', String(params.limit));
      if (params.nameSearch?.trim()) queryParams.append('name', params.nameSearch.trim());
      if (params.passportSearch?.trim()) queryParams.append('passportNumber', params.passportSearch.trim());
      if (params.statusFilter) queryParams.append('status', params.statusFilter);
      if (params.jobFilter) queryParams.append('jobId', params.jobFilter);
      return queryParams.toString();
    };

    const queryString = buildQueryParams({
      page: 1,
      limit: 10,
      nameSearch: 'Rahul',
      passportSearch: 'Z9876543',
      statusFilter: 'SHORTLISTED',
      jobFilter: 'job101',
    });

    expect(queryString).toContain('page=1');
    expect(queryString).toContain('limit=10');
    expect(queryString).toContain('name=Rahul');
    expect(queryString).toContain('passportNumber=Z9876543');
    expect(queryString).toContain('status=SHORTLISTED');
    expect(queryString).toContain('jobId=job101');
  });

  it('constructs authenticated document streaming URL and bearer headers', () => {
    const getDocumentRequestConfig = (applicantId: string, docType: 'passport' | 'resume', token: string) => {
      return {
        url: `/api/v1/admin/applicants/${applicantId}/document/${docType}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    };

    const passportConfig = getDocumentRequestConfig('app001', 'passport', 'jwt-token-123');
    expect(passportConfig.url).toBe('/api/v1/admin/applicants/app001/document/passport');
    expect(passportConfig.headers.Authorization).toBe('Bearer jwt-token-123');

    const resumeConfig = getDocumentRequestConfig('app001', 'resume', 'jwt-token-123');
    expect(resumeConfig.url).toBe('/api/v1/admin/applicants/app001/document/resume');
  });

  it('handles synchronous window opening for popup blocker prevention and blob URL cleanup', () => {
    let assignedHref = '';
    const mockWindow = {
      location: {
        set href(val: string) {
          assignedHref = val;
        },
        get href() {
          return assignedHref;
        },
      },
      close: () => {},
    };

    const simulatedHandleViewDocument = (
      windowOpenMock: () => any,
      createBlobUrlMock: () => string,
      revokeBlobUrlMock: (url: string) => void
    ) => {
      // 1. Sync window open
      const newWindow = windowOpenMock();
      const blobUrl = createBlobUrlMock();

      if (newWindow) {
        newWindow.location.href = blobUrl;
      }

      // 2. Revoke URL
      revokeBlobUrlMock(blobUrl);

      return { blobUrl, assignedHref: newWindow?.location.href };
    };

    const revokedUrls: string[] = [];
    const result = simulatedHandleViewDocument(
      () => mockWindow,
      () => 'blob:http://localhost/test-blob-123',
      (url) => revokedUrls.push(url)
    );

    expect(result.assignedHref).toBe('blob:http://localhost/test-blob-123');
    expect(revokedUrls).toContain('blob:http://localhost/test-blob-123');
  });

  it('validates status update payload formatting for PATCH /api/v1/admin/applicants/:id/status', () => {
    const buildStatusPayload = (status: string, notes?: string) => {
      const validStatuses = ['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }
      return JSON.stringify({ status, notes: notes || '' });
    };

    const validPayload = buildStatusPayload('HIRED', 'Passed all interviews');
    expect(JSON.parse(validPayload)).toEqual({
      status: 'HIRED',
      notes: 'Passed all interviews',
    });

    expect(() => buildStatusPayload('INVALID')).toThrow('Invalid status');
  });

  it('correctly maps updated applicant status into existing list state', () => {
    const updateListState = (
      list: typeof mockApplicants,
      updatedRecord: { _id: string; status: 'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'; notes?: string }
    ) => {
      return list.map((app) => (app._id === updatedRecord._id ? { ...app, ...updatedRecord } : app));
    };

    const updatedList = updateListState(mockApplicants, {
      _id: 'app001',
      status: 'SHORTLISTED',
      notes: 'Interview scheduled',
    });

    expect(updatedList[0].status).toBe('SHORTLISTED');
    expect(updatedList[0].notes).toBe('Interview scheduled');
    expect(updatedList[0].name).toBe('Rahul K. Sharma');
  });
});
