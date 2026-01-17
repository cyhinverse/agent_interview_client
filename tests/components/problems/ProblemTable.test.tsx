import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProblemTable } from '@/components/problems/ProblemTable';

const mockProblems = [
  {
    id: '1',
    title: 'Problem 1',
    category: 'Two Pointers',
    difficulty: 'Easy',
    points: 10,
  },
  {
    id: '2',
    title: 'Problem 2',
    category: 'DP',
    difficulty: 'Hard',
    points: 50,
  },
];

describe('ProblemTable Component', () => {
  it('renders list of problems', () => {
    render(<ProblemTable problems={mockProblems} />);
    expect(screen.getByText('Problem 1')).toBeInTheDocument();
    expect(screen.getByText('Problem 2')).toBeInTheDocument();
    expect(screen.getByText('Two Pointers')).toBeInTheDocument();
    // Use getByText with exact: false or regular expression for difficulty rendering
    // since implementation renders difficulty inside a span
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders empty state when no problems', () => {
    render(<ProblemTable problems={[]} />);
    expect(
      screen.getByText('No protocols found for this category.')
    ).toBeInTheDocument();
  });
});
