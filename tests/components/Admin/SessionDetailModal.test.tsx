import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionDetailModal } from '@/components/Admin/SessionDetailModal';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

describe('SessionDetailModal', () => {
  const mockSession: any = {
    id: 'sess1-uuid-1234',
    status: 'COMPLETED',
    score: 95,
    createdAt: '2024-01-01T10:00:00Z',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T11:00:00Z',
    user: { fullName: 'John Doe', email: 'john@example.com' },
    category: { name: 'React Interview' },
    responses: [
      { id: 'r1', score: 90 },
      { id: 'r2', score: 100 },
    ],
  };

  it('renders nothing when closed', () => {
    render(
      <SessionDetailModal
        isOpen={false}
        onClose={jest.fn()}
        session={mockSession}
      />
    );
    expect(screen.queryByText('Session Details')).not.toBeInTheDocument();
  });

  it('renders session details when open', () => {
    render(
      <SessionDetailModal
        isOpen={true}
        onClose={jest.fn()}
        session={mockSession}
      />
    );
    expect(screen.getByText('Session Details')).toBeInTheDocument();
    expect(screen.getByText('sess1-uu...')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('React Interview')).toBeInTheDocument();
    expect(screen.getByText('Responses (2)')).toBeInTheDocument();
  });

  it('calls onClose when closed', () => {
    const onClose = jest.fn();
    render(
      <SessionDetailModal
        isOpen={true}
        onClose={onClose}
        session={mockSession}
      />
    );
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
});
