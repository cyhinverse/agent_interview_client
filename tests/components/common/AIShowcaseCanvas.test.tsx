import React from 'react';
import { render } from '@testing-library/react';
import AISHowcaseCanvas from '@/components/common/AISHowcaseCanvas';

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark' }),
}));

describe('AISHowcaseCanvas Component', () => {
  let originalGetContext: any;

  beforeAll(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
      if (contextType === '2d') {
        return {
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          moveTo: jest.fn(),
          lineTo: jest.fn(),
          stroke: jest.fn(),
          createRadialGradient: jest
            .fn()
            .mockReturnValue({ addColorStop: jest.fn() }),
          fillRect: jest.fn(),
          save: jest.fn(),
          translate: jest.fn(),
          restore: jest.fn(),
          fillText: jest.fn(),
          arc: jest.fn(),
          fill: jest.fn(),
        };
      }
      return null;
    }) as any;
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders canvas without crashing', () => {
    const { container } = render(<AISHowcaseCanvas />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
