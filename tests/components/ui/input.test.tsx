import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('should have data-slot attribute', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Types', () => {
    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      // Input without type attribute defaults to text
      expect(input).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('States', () => {
    it('should render disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should render readonly state', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should render required state', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('Value and onChange', () => {
    it('should render with default value', () => {
      render(<Input defaultValue="Default text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Default text');
    });

    it('should handle value changes', () => {
      const onChange = jest.fn();
      render(<Input onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New value' } });
      expect(onChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      const { rerender } = render(
        <Input value="initial" onChange={() => {}} />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');

      rerender(<Input value="updated" onChange={() => {}} />);
      expect(input).toHaveValue('updated');
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Username" />);
      const input = screen.getByRole('textbox', { name: 'Username' });
      expect(input).toBeInTheDocument();
    });

    it('should support aria-invalid', () => {
      render(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Events', () => {
    it('should handle focus events', () => {
      const onFocus = jest.fn();
      render(<Input onFocus={onFocus} />);
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('should handle blur events', () => {
      const onBlur = jest.fn();
      render(<Input onBlur={onBlur} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });

    it('should handle keydown events', () => {
      const onKeyDown = jest.fn();
      render(<Input onKeyDown={onKeyDown} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
