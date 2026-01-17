import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroVideo from '@/components/home/HeroVideo';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
  },
  useScroll: jest.fn().mockReturnValue({ scrollYProgress: { get: () => 0 } }),
  useTransform: jest.fn().mockReturnValue(0),
  useInView: jest.fn().mockReturnValue(true),
}));

jest.mock('@/components/home/CodeDemo', () => () => (
  <div data-testid="code-demo">Code Demo</div>
));

describe('HeroVideo Component', () => {
  it('renders correctly', () => {
    render(<HeroVideo />);
    expect(screen.getByText('aa-interview-platform.demo')).toBeInTheDocument();
    expect(screen.getByTestId('code-demo')).toBeInTheDocument();
  });
});
