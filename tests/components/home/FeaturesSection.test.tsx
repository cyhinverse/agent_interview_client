import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '@/components/home/FeaturesSection';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
  useInView: jest.fn().mockReturnValue(true),
}));

// Mock child components
jest.mock('@/components/home/InterviewDemo', () => () => (
  <div data-testid="interview-demo">Interview Demo</div>
));
jest.mock('@/components/home/CodeDemo', () => () => (
  <div data-testid="code-demo">Code Demo</div>
));

describe('FeaturesSection Component', () => {
  it('renders feature blocks', () => {
    render(<FeaturesSection />);

    expect(
      screen.getByText('Master the Technical Interview')
    ).toBeInTheDocument();
    expect(screen.getByText('AI INTERVIEWER')).toBeInTheDocument();

    expect(screen.getByText('Code Live, Without Limits')).toBeInTheDocument();
    expect(screen.getByText('LIVE CODING ENVIRONMENT')).toBeInTheDocument();
  });

  it('renders demos', () => {
    render(<FeaturesSection />);
    expect(screen.getByTestId('interview-demo')).toBeInTheDocument();
    expect(screen.getByTestId('code-demo')).toBeInTheDocument();
  });
});
