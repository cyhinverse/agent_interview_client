import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

describe('Sheet Component', () => {
  it('opens and closes sheet', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
          <div>Sheet Content</div>
        </SheetContent>
      </Sheet>
    );

    const trigger = screen.getByText('Open Sheet');
    expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Sheet Content')).toBeInTheDocument();

    // Close sheet
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Sheet Content')).not.toBeInTheDocument();
    });
  });
});
