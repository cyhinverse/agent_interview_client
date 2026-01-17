import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionManagementTable } from '@/components/Admin/SessionManagementTable';
import { useDeleteSession } from '@/hooks/useAdmin';

jest.mock('@/hooks/useAdmin', () => ({
  useDeleteSession: jest.fn(),
}));

describe('SessionManagementTable Component', () => {
  const mockDelete = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    (useDeleteSession as jest.Mock).mockReturnValue({
      mutateAsync: mockDelete,
    });
    window.confirm = jest.fn().mockReturnValue(true);
  });

  const mockSessions = [
    {
      id: 'sess1',
      userId: 'user1',
      categoryId: 'cat1',
      status: 'COMPLETED' as const,
      startTime: '2023-01-01T10:00:00Z',
      endTime: '2023-01-01T11:00:00Z',
      score: 80,
      createdAt: '2023-01-01',
      category: { name: 'Backend' },
    },
  ];

  it('renders sessions', () => {
    render(<SessionManagementTable sessions={mockSessions} />);
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('1h 0m')).toBeInTheDocument(); // Duration
  });
});
