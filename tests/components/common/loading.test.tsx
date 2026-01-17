import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '@/components/common/loading';

describe('Loading', () => {
  it('should render loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render as h1 heading', () => {
    render(<Loading />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Loading...' })
    ).toBeInTheDocument();
  });

  it('should be wrapped in a div', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
