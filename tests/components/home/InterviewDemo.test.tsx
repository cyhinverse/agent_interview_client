import React from 'react';
import { render, screen, act } from '@testing-library/react';
import InterviewDemo from '@/components/home/InterviewDemo';

describe('InterviewDemo Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial state', () => {
    render(<InterviewDemo isInView={false} />);
    expect(screen.getByText('REC 00:04:23')).toBeInTheDocument();
  });

  it('starts simulation when isInView is true', async () => {
    render(<InterviewDemo isInView={true} />);

    // Fast-forward to first message
    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(
      screen.getByText(/Let's discuss the time complexity/i)
    ).toBeInTheDocument();
  });

  it('progresses through simulation', async () => {
    render(<InterviewDemo isInView={true} />);

    // Fast-forward to second message
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.getByText(/Sure. I used a Hash Map/i)).toBeInTheDocument();

    // Fast-forward to third message
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(
      screen.getByText(/That gives us O\(n\) lookup time/i)
    ).toBeInTheDocument();
  });

  it('cleans up timeouts on unmount', () => {
    const { unmount } = render(<InterviewDemo isInView={true} />);
    const spy = jest.spyOn(global, 'clearTimeout');
    unmount();
    expect(spy).toHaveBeenCalled();
  });
});
