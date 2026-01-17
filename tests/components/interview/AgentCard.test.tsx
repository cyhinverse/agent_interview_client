import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgentCard } from '@/components/interview/AgentCard';

// Mock mocks
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/hooks/useInterviewCategories', () => ({
  useCreateInterviewSession: () => ({
    mutateAsync: jest.fn().mockResolvedValue({ id: 'session-123' }),
    isLoading: false,
  }),
}));

const mockAgent = {
  id: 'agent-1',
  name: 'Code Reviewer',
  type: 'Utility',
  desc: 'Reviews code.',
  complexity: 'Low',
};

describe('AgentCard Component', () => {
  it('renders agent details', () => {
    render(<AgentCard agent={mockAgent} index={0} />);
    expect(screen.getByText('Code Reviewer')).toBeInTheDocument();
    expect(screen.getByText('Utility')).toBeInTheDocument();
    expect(screen.getByText('Reviews code.')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('renders start button', () => {
    render(<AgentCard agent={mockAgent} index={0} />);
    expect(screen.getByText('Start Mission')).toBeInTheDocument();
  });
});
