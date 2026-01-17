import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TextCycler from '@/components/common/TextCycler';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: { children: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('TextCycler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render initial word', () => {
    render(<TextCycler />);
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
  });

  it('should have invisible spacer for layout stability', () => {
    render(<TextCycler />);
    // The spacer text "Engineering" should exist but be invisible
    const allEngineering = screen.getAllByText('Engineering');
    // At least one should be the spacer (invisible)
    const spacer = allEngineering.find((el) =>
      el.classList.contains('invisible')
    );
    expect(spacer).toBeInTheDocument();
  });

  it('should cycle to next word after interval', () => {
    render(<TextCycler />);

    expect(screen.getByText('AI Agents')).toBeInTheDocument();

    // Advance timer by 2500ms
    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.getByText('Interviews')).toBeInTheDocument();
  });

  it('should cycle through all words', () => {
    render(<TextCycler />);

    const words = [
      'AI Agents',
      'Interviews',
      'Success',
      'Excellence',
      'Engineering',
    ];

    words.forEach((word, index) => {
      if (index > 0) {
        act(() => {
          jest.advanceTimersByTime(2500);
        });
      }

      // 'Engineering' appears twice (once in the motion span, once as an invisible spacer)
      const elements = screen.getAllByText(word);
      expect(elements.length).toBeGreaterThanOrEqual(1);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it('should loop back to first word after all words', () => {
    render(<TextCycler />);

    // Cycle through all 5 words
    act(() => {
      jest.advanceTimersByTime(2500 * 5);
    });

    // Should be back to first word
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
  });

  it('should clean up timer on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = render(<TextCycler />);
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
