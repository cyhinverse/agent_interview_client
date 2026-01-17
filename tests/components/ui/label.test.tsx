import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('renders children correctly', () => {
    render(<Label htmlFor="email">Email Address</Label>);
    const label = screen.getByText('Email Address');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'email');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Label className="text-red-500">Error Label</Label>
    );
    // Label is a label element
    expect(container.firstElementChild).toHaveClass('text-red-500');
  });
});
