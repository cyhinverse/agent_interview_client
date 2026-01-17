import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from '@/components/ui/scroll-area';

describe('ScrollArea Component', () => {
  it('renders children correctly', () => {
    render(
      <ScrollArea className="h-[200px] w-[350px]">
        <div>Scrollable content</div>
      </ScrollArea>
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollArea className="custom-scroll-area">
        <div>Content</div>
      </ScrollArea>
    );
    // The root element should have the class
    expect(container.firstChild).toHaveClass('custom-scroll-area');
  });
});
