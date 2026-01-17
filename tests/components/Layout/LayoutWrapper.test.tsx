import React from 'react';
import { render, screen } from '@testing-library/react';
import LayoutWrapper from '@/components/Layout/LayoutWrapper';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/components/Layout/Header', () => () => (
  <header>MockHeader</header>
));
jest.mock('@/components/Layout/Footer', () => () => (
  <footer>MockFooter</footer>
));

describe('LayoutWrapper', () => {
  it('renders header and footer for normal pages', () => {
    (usePathname as jest.Mock).mockReturnValue('/home');
    render(
      <LayoutWrapper>
        <div>Content</div>
      </LayoutWrapper>
    );

    expect(screen.getByText('MockHeader')).toBeInTheDocument();
    expect(screen.getByText('MockFooter')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render header and footer for admin pages', () => {
    (usePathname as jest.Mock).mockReturnValue('/admin/dashboard');
    render(
      <LayoutWrapper>
        <div>Admin Content</div>
      </LayoutWrapper>
    );

    expect(screen.queryByText('MockHeader')).not.toBeInTheDocument();
    expect(screen.queryByText('MockFooter')).not.toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
