import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

jest.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Image: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} />
  ),
  Fallback: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

describe('Avatar Component', () => {
  it('renders avatar image when src is provided', () => {
    render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const image = screen.getByRole('img', { name: /@shadcn/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://github.com/shadcn.png');
  });

  it('renders fallback when image is missing', () => {
    render(
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText('CN');
    expect(fallback).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Avatar className="custom-class">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
