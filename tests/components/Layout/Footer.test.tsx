import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Layout/Footer';

describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />);
    // Check for logo/title
    expect(screen.getByText(/𝕬𝖌𝖊𝖓𝖙 𝕴𝖓𝖙𝖊𝖗𝖛𝖎𝖊𝖜/i)).toBeInTheDocument();

    // Check for sections
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();

    // Check for links
    expect(screen.getByText('Problems')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    // Check copyright
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
