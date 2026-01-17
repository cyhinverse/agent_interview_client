import React from 'react';
import { render } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('data-[orientation=horizontal]:h-px');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('data-[orientation=vertical]:h-full');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });
});
