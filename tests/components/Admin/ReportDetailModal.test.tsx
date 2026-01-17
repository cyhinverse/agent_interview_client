import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportDetailModal } from '@/components/Admin/ReportDetailModal';
import { EvaluationReport } from '@/features/users/usersApi';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

describe('ReportDetailModal', () => {
  const mockReport: EvaluationReport = {
    id: '1',
    sessionId: 'sess1',
    userId: 'user1',
    overallScore: 85,
    technicalScore: 90,
    communicationScore: 80,
    problemSolvingScore: 85,
    feedback: 'Great job!',
    strengths: ['Coding', 'Debugging'],
    areasForImprovement: ['Testing'],
    recommendations: ['Practice more'],
    createdAt: '2024-01-01T10:00:00Z',
  };

  it('renders nothing when closed', () => {
    render(
      <ReportDetailModal
        isOpen={false}
        onClose={jest.fn()}
        report={mockReport}
      />
    );
    expect(screen.queryByText('Evaluation Report')).not.toBeInTheDocument();
  });

  it('renders report details when open', () => {
    render(
      <ReportDetailModal
        isOpen={true}
        onClose={jest.fn()}
        report={mockReport}
      />
    );
    expect(screen.getByText('Evaluation Report')).toBeInTheDocument();
    expect(screen.getByText('Great job!')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(
      <ReportDetailModal isOpen={true} onClose={onClose} report={mockReport} />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
