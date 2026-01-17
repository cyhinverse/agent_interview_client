import React from 'react';
import { render } from '@testing-library/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';

describe('InputOTP Component', () => {
  it('renders InputOTP component', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );

    // The component usually renders an invisible input for logic
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();

    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]');
    expect(slots).toHaveLength(6);
  });

  it('renders InputOTPSeparator', () => {
    const { container } = render(
      <InputOTP maxLength={6}>
        <InputOTPSeparator />
      </InputOTP>
    );
    const separator = container.querySelector(
      '[data-slot="input-otp-separator"]'
    );
    expect(separator).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InputOTP maxLength={6} containerClassName="custom-container">
        <InputOTPGroup className="group-class">
          <InputOTPSlot index={0} className="slot-class" />
        </InputOTPGroup>
      </InputOTP>
    );

    const slot = container.querySelector('[data-slot="input-otp-slot"]');
    expect(slot).toHaveClass('slot-class');

    const group = container.querySelector('[data-slot="input-otp-group"]');
    expect(group).toHaveClass('group-class');
  });
});
