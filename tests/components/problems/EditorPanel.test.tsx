import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorPanel } from '@/components/problems/EditorPanel';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

describe('EditorPanel', () => {
  it('renders correctly', () => {
    render(<EditorPanel />);
    expect(screen.getByText('Python 3.10')).toBeInTheDocument();
    expect(screen.getByText('ProtocolSolver')).toBeInTheDocument();
    expect(screen.getByText('Terminal Ready')).toBeInTheDocument();
  });

  it('contains interaction buttons', () => {
    render(<EditorPanel />);
    expect(screen.getByText('Run Code')).toBeInTheDocument();
  });
});
