import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminSidebar } from '@/components/Admin/AdminSidebar';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('AdminSidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/admin');
  });

  it('should render navigation items', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Documents')).toBeInTheDocument();
  });

  it('should highlight active link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/users');
    render(<AdminSidebar />);

    const userLinkParent = screen.getByText('User Management').closest('div');
    // Check for the active class (bg-primary)
    expect(userLinkParent?.parentElement?.parentElement).toHaveClass(
      'bg-primary'
    );
  });

  it('should toggle collapsed state on button click', () => {
    render(<AdminSidebar />);

    const toggleButton = screen.getByRole('button');

    // Initially not collapsed (shows text)
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toggleButton);

    // Should be collapsed (text should be hidden or removed)
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(toggleButton);
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });
});
