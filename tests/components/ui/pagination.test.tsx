import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
    totalItems: 100,
    onPageChange: jest.fn(),
  };

  it('renders correct page numbers', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument(); // Logic shows ... for 10 pages
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calls onPageChange when clicking a page number', () => {
    render(<Pagination {...defaultProps} />);
    // Click page 2
    // We need to find the button for page 2. Since implementation depends on visible pages logic...
    // Initial visible: 1, 2, 3, 4, ..., 10
    fireEvent.click(screen.getByText('2'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables prev button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const prevButtons = screen.getAllByRole('button').slice(0, 2); // First two are << and <
    prevButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    // Last buttons are > and >>
    const buttons = screen.getAllByRole('button');
    expect(buttons[buttons.length - 1]).toBeDisabled();
    expect(buttons[buttons.length - 2]).toBeDisabled();
  });
});
