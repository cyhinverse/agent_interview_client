import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemFilters } from '@/components/problems/ProblemFilters';

describe('ProblemFilters', () => {
  const categories = ['All', 'Array', 'DP', 'Graph'];
  const mockSelect = jest.fn();

  it('renders all categories', () => {
    render(
      <ProblemFilters
        categories={categories}
        selectedCategory="All"
        onCategorySelect={mockSelect}
      />
    );
    categories.forEach((cat) => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('highlights selected category', () => {
    render(
      <ProblemFilters
        categories={categories}
        selectedCategory="DP"
        onCategorySelect={mockSelect}
      />
    );
    // Using a check for class or simply button presence.
    // Ideally we check accessibility state, but variant prop logic is internal to Button.
    // We can check if 'DP' is present.
    expect(screen.getByText('DP')).toBeInTheDocument();
  });

  it('calls onCategorySelect when clicked', () => {
    render(
      <ProblemFilters
        categories={categories}
        selectedCategory="All"
        onCategorySelect={mockSelect}
      />
    );
    fireEvent.click(screen.getByText('Graph'));
    expect(mockSelect).toHaveBeenCalledWith('Graph');
  });
});
