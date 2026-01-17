import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserRoleModal } from '@/components/Admin/UserRoleModal';
import { useUpdateUserRole } from '@/hooks/useAdmin';

jest.mock('@/hooks/useAdmin', () => ({
  useUpdateUserRole: jest.fn(),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

// Mock Select to make it easier to test interaction without full radix dropdown logic complexity
jest.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, children }: any) => (
    <div data-testid="select" onClick={() => onValueChange('ADMIN')}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => <div>Select Value</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe('UserRoleModal', () => {
  const mockUser: any = {
    id: 'u1',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'CANDIDATE',
  };

  const mockMutate = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    (useUpdateUserRole as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders correctly', () => {
    render(<UserRoleModal isOpen={true} onClose={jest.fn()} user={mockUser} />);
    expect(screen.getByText('Edit User Role')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('calls updateRole on submit', async () => {
    const onSuccess = jest.fn();
    render(
      <UserRoleModal
        isOpen={true}
        onClose={jest.fn()}
        user={mockUser}
        onSuccess={onSuccess}
      />
    );

    // Simulate changing role by clicking mock select which triggers onValueChange('ADMIN')
    fireEvent.click(screen.getByTestId('select'));

    fireEvent.click(screen.getByText('Update Role'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        userId: 'u1',
        role: 'ADMIN',
      });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});
