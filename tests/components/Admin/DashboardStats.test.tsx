import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '@/components/Admin/DashboardStats';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('DashboardStats', () => {
  const mockStats = {
    totalUsers: 1250,
    activeUsers: 85,
    totalSessions: 450,
    totalDocuments: 120,
    totalResponses: 3200,
    averageSessionScore: 78.5,
  };

  it('should render all stat cards with correct titles', () => {
    render(<DashboardStats stats={mockStats} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Sessions')).toBeInTheDocument();
    expect(screen.getByText('Total Documents')).toBeInTheDocument();
    expect(screen.getByText('Total Responses')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Avg Session Score')).toBeInTheDocument();
  });

  it('should display correctly formatted values', () => {
    render(<DashboardStats stats={mockStats} />);

    // totalUsers: 1,250 (toLocaleString)
    expect(screen.getByText('1,250')).toBeInTheDocument();
    // averageSessionScore: 78.5% (toFixed(1))
    expect(screen.getByText('78.5%')).toBeInTheDocument();
    // totalResponses: 3,200
    expect(screen.getByText('3,200')).toBeInTheDocument();
  });

  it('should handle missing stats gracefully', () => {
    // @ts-ignore - testing null/undefined stats
    render(<DashboardStats stats={null} />);

    // Values should default to 0 or 0.0%
    const zeroResults = screen.getAllByText('0');
    expect(zeroResults.length).toBeGreaterThan(0);
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('should render trending indicators', () => {
    render(<DashboardStats stats={mockStats} />);

    // The component has hardcoded change values for now (like +12%, +8%, etc.)
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });
});
