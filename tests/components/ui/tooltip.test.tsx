import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

jest.mock('@radix-ui/react-tooltip', () => {
  const React = require('react');
  const TooltipContext = React.createContext({
    open: false,
    setOpen: (o: boolean) => {},
  });

  return {
    Provider: ({ children }: any) => <div>{children}</div>,
    Root: ({ children }: any) => {
      const [open, setOpen] = React.useState(false);
      return (
        <TooltipContext.Provider value={{ open, setOpen }}>
          {children}
        </TooltipContext.Provider>
      );
    },
    Trigger: ({ children, ...props }: any) => {
      const { setOpen } = React.useContext(TooltipContext);
      return (
        <button
          {...props}
          onMouseEnter={() => setOpen(true)}
          onPointerEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onPointerLeave={() => setOpen(false)}
          data-state="closed"
        >
          {children}
        </button>
      );
    },
    Content: ({ children, ...props }: any) => {
      const { open } = React.useContext(TooltipContext);
      return open ? (
        <div role="tooltip" {...props}>
          {children}
        </div>
      ) : null;
    },
    Portal: ({ children }: any) => <div>{children}</div>,
    Arrow: ({ className }: any) => <div className={className} />,
  };
});

describe('Tooltip Component', () => {
  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Hover me');
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });
});
