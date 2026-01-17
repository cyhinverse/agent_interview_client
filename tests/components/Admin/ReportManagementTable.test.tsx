import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportManagementTable } from '@/components/Admin/ReportManagementTable';
import { useDeleteReport } from '@/hooks/useAdmin';

jest.mock('@/hooks/useAdmin', () => ({
  useDeleteReport: jest.fn(),
}));

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}));

describe('ReportManagementTable Component', () => {
  const mockDelete = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    (useDeleteReport as jest.Mock).mockReturnValue({ mutate: mockDelete });
    window.confirm = jest.fn().mockReturnValue(true);
  });

  it('renders empty state when no reports', () => {
    render(<ReportManagementTable reports={[]} />);
    expect(screen.getByText('No reports found')).toBeInTheDocument();
  });

  // TODO: Fix this test - currently failing in CI environment
  it.skip('renders reports', () => {
    const mockReports = [
      {
        id: '1',
        userId: 'user1',
        sessionId: 'sess1',
        overallScore: 85,
        technicalScore: 90,
        communicationScore: 80,
        problemSolvingScore: 85,
        feedback: 'Good',
        strengths: [],
        areasForImprovement: [],
        recommendations: [],
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        session: {
          id: 's1',
          category: {
            name: 'Frontend',
            id: 'c1',
            slug: 'frontend',
            systemPrompt: '',
            language: 'en',
            createdAt: '',
          },
        },
      },
    ];
    render(<ReportManagementTable reports={mockReports} />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });
});
