import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemHeader } from '@/components/problems/ProblemHeader';

describe('ProblemHeader', () => {
  const props = {
    title: 'Two Sum',
    difficulty: 'Medium',
    isFullScreen: false,
    onToggleFullScreen: jest.fn(),
  };

  it('renders title and difficulty', () => {
    render(<ProblemHeader {...props} />);
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders navigation link when not full screen', () => {
    // ChevronLeft is inside the link
    render(<ProblemHeader {...props} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/problems');
  });

  it('does not render navigation link when full screen', () => {
    render(<ProblemHeader {...props} isFullScreen={true} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('toggles full screen', () => {
    render(<ProblemHeader {...props} />);
    // Finding the toggle button can be tricky without aria-label in some setups,
    // but here it has title 'Enter Full Screen'
    const toggleBtn = screen.getByTitle('Enter Full Screen');
    fireEvent.click(toggleBtn);
    expect(props.onToggleFullScreen).toHaveBeenCalled();
  });
});
