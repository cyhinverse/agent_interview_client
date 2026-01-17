import React from 'react';
import { render } from '@testing-library/react';
import ParticleBackground from '@/components/common/ParticleBackground';

jest.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'dark' }),
}));

describe('ParticleBackground Component', () => {
  let originalGetContext: any;

  beforeAll(() => {
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = jest.fn((contextType: string) => {
      if (contextType === '2d') {
        return {
          clearRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          fill: jest.fn(),
          moveTo: jest.fn(),
          lineTo: jest.fn(),
          stroke: jest.fn(),
          fillStyle: '',
          strokeStyle: '',
          lineWidth: 0,
        };
      }
      return null;
    }) as any;
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders canvas without crashing', () => {
    const { container } = render(<ParticleBackground />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
