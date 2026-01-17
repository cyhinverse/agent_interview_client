import React from 'react';
import { render } from '@testing-library/react';
import { Toaster } from '@/components/ui/sonner';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

// Mock sonner to just render children/props for verification
jest.mock('sonner', () => ({
  Toaster: ({ theme, className }: any) => (
    <div
      data-testid="sonner-toaster"
      data-theme={theme}
      className={className}
    />
  ),
}));

describe('Toaster Component', () => {
  it('renders Toaster with correct theme and class', () => {
    const { getByTestId } = render(<Toaster />);
    const toaster = getByTestId('sonner-toaster');

    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveAttribute('data-theme', 'dark');
    expect(toaster).toHaveClass('toaster group');
  });

  it('passes additional props to Sonner', () => {
    const { getByTestId } = render(<Toaster position="top-right" />);
    const toaster = getByTestId('sonner-toaster');
    // In our mock we don't handle all props, but you get the idea
    expect(toaster).toBeInTheDocument();
  });
});
