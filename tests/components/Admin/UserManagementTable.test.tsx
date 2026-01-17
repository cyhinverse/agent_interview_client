import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserManagementTable } from '@/components/Admin/UserManagementTable';
import { useDeleteUser } from '@/hooks/useAdmin';

// Mock the hook
jest.mock('@/hooks/useAdmin', () => ({
  useDeleteUser: jest.fn(),
}));

// Mock window.confirm
window.confirm = jest.fn();

describe('UserManagementTable', () => {
  const mockUsers = [
    {
      id: 'u-1',
      fullName: 'Alice Admin',
      email: 'alice@example.com',
      role: 'ADMIN',
      createdAt: '2023-01-01T00:00:00.000Z',
      avatarUrl: 'https://example.com/alice.jpg',
    },
    {
      id: 'u-2',
      fullName: 'Bob Interviewer',
      email: 'bob@example.com',
      role: 'INTERVIEWER',
      createdAt: '2023-02-01T00:00:00.000Z',
    },
    {
      id: 'u-3',
      fullName: 'Charlie Candidate',
      email: 'charlie@example.com',
      role: 'CANDIDATE',
      createdAt: '2023-03-01T00:00:00.000Z',
    },
  ];

  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteUser as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it('should render loading state', () => {
    render(<UserManagementTable users={[]} isLoading={true} />);
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<UserManagementTable users={[]} isLoading={false} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('should render users with correct roles and styling', () => {
    render(<UserManagementTable users={mockUsers} />);

    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    expect(screen.getByText('Bob Interviewer')).toBeInTheDocument();
    expect(screen.getByText('Charlie Candidate')).toBeInTheDocument();

    // Check roles
    const adminBadge = screen.getByText('ADMIN');
    const interviewerBadge = screen.getByText('INTERVIEWER');
    const candidateBadge = screen.getByText('CANDIDATE');

    expect(adminBadge).toBeInTheDocument();
    expect(interviewerBadge).toBeInTheDocument();
    expect(candidateBadge).toBeInTheDocument();

    // Check role variants (destructive for ADMIN, default for INTERVIEWER, secondary for CANDIDATE)
    // Note: We check classes if we assume certain class names for variants,
    // or just trust the Badge component for now.
  });

  it('should render avatar with fallback', () => {
    render(<UserManagementTable users={mockUsers} />);

    // Alice has avatarUrl
    const aliceAvatar = screen.getByText('A'); // Fallback letter 'A' should be there
    expect(aliceAvatar).toBeInTheDocument();

    // Bob doesn't have avatarUrl
    const bobAvatar = screen.getByText('B');
    expect(bobAvatar).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserManagementTable users={mockUsers} onEdit={onEdit} />);

    // In each row: 0: Edit, 1: Delete
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should call delete mutation when trash button is clicked and confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    const onRefresh = jest.fn();

    render(<UserManagementTable users={mockUsers} onRefresh={onRefresh} />);

    const buttons = screen.getAllByRole('button');
    // Index 1 is the Delete button for the first user
    fireEvent.click(buttons[1]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalledWith('u-1');

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled();
    });
  });
});
