import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/components/Layout/Header';

// Mock hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

jest.mock('@/hooks', () => ({
  useCurrentUser: jest.fn(),
}));

import { useCurrentUser } from '@/hooks';

describe('Header Component', () => {
  it('renders logo', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
    render(<Header />);
    expect(screen.getByText(/𝕬𝖌𝖊𝖓𝖙 𝕴𝖓𝖙𝖊𝖗𝖛𝖎𝖊𝖜/i)).toBeInTheDocument();
  });

  it('renders login button when user is not logged in', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
    render(<Header />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders user greeting when user is logged in', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({
      data: { fullName: 'Test User' },
    });
    render(<Header />);
    expect(screen.getByText('Hello,')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({ data: null });
    render(<Header />);
    expect(screen.getByText('Interview')).toBeInTheDocument();
    expect(screen.getByText('Problems')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });
});
