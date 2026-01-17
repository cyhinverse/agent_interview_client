import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProblemDescription } from '@/components/problems/ProblemDescription';

const mockProblem = {
  timeLimit: '1s',
  memoryLimit: '256MB',
  points: 100,
  description: 'Test problem description',
  examples: [{ input: '1 2', output: '3', explanation: '1 + 2 = 3' }],
  constraints: ['1 <= n <= 100'],
};

// Mock React 19 APIs that might not be fully supported in JSDOM yet
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    ViewTransition: ({ children }: any) => <div>{children}</div>,
    Activity: ({ children, mode }: any) =>
      mode === 'visible' ? <div>{children}</div> : null,
  };
});

describe('ProblemDescription Component', () => {
  it('renders problem details', () => {
    render(
      <ProblemDescription
        problem={mockProblem}
        activeTab="description"
        onTabChange={jest.fn()}
      />
    );

    expect(screen.getByText('Test problem description')).toBeInTheDocument();
    expect(screen.getByText('1s')).toBeInTheDocument();
    expect(screen.getByText('256MB')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders examples', () => {
    render(
      <ProblemDescription
        problem={mockProblem}
        activeTab="description"
        onTabChange={jest.fn()}
      />
    );
    expect(screen.getByText('1 2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Note: 1 + 2 = 3')).toBeInTheDocument();
  });
});
