import React from 'react';
import { render, screen, act } from '@testing-library/react';
import CodeDemo from '@/components/home/CodeDemo';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    span: ({ children, className }: any) => (
      <span className={className}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

describe('CodeDemo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial state correctly', () => {
    render(<CodeDemo isInView={false} />);
    expect(screen.getByText('solution.js')).toBeInTheDocument();
    // Initially code block might be empty or static parts only
    expect(screen.getByText('function')).toBeInTheDocument();
  });

  it('starts typing when in view', () => {
    render(<CodeDemo isInView={true} />);

    // Fast-forward time to trigger typing start (400ms delay)
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Check if status changed to typing - verify by some content presence or just no error
    // CodeDemo implementation gradually adds text.
    // Let's advance a bit more to see some text appear
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // We expect some content to be populated from the snippet.
    // The snippet contains "Use a hash map".
    // It is typed char by char.
    // 1000ms / 40ms interval = 25 chars approx.
    // "  // Use a hash map" is about 19 chars.
    screen.getByText((content) => content.includes('Use a hash'));
  });
});
