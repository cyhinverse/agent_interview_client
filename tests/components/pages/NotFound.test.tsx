import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '@/components/pages/NotFound';

describe('NotFound Component', () => {
  it('renders correctly', () => {
    render(<NotFound />);
    expect(screen.getByText(/NOT FOUND - 404/i)).toBeInTheDocument();
  });
});
