import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('should have data-slot attribute', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge).toHaveAttribute('data-slot', 'badge');
    });

    it('should render as span by default', () => {
      render(<Badge>Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText('Default');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-primary');
    });

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText('Secondary');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-secondary');
    });

    it('should render destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      const badge = screen.getByText('Destructive');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-destructive');
    });

    it('should render outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText('Outline');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('text-foreground');
    });
  });

  describe('asChild prop', () => {
    it('should render as Slot when asChild is true', () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      );
      const link = screen.getByRole('link', { name: /link badge/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Children', () => {
    it('should render text children', () => {
      render(<Badge>Text Content</Badge>);
      expect(screen.getByText('Text Content')).toBeInTheDocument();
    });

    it('should render with icon and text', () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });
});
