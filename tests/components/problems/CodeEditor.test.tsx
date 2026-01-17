import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeEditor } from '@/components/problems/CodeEditor';

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => {
  const FakeEditor = jest.fn(({ value, onChange }) => {
    return (
      <textarea
        data-testid="monaco-editor-mock"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  });
  return {
    __esModule: true,
    default: FakeEditor,
  };
});

describe('CodeEditor Component', () => {
  const mockOnChange = jest.fn();

  it('renders editor with value', () => {
    render(<CodeEditor value="console.log('hello')" onChange={mockOnChange} />);
    expect(screen.getByTestId('monaco-editor-mock')).toHaveValue(
      "console.log('hello')"
    );
  });

  it('calls onChange when edited', () => {
    render(<CodeEditor value="" onChange={mockOnChange} />);
    const editor = screen.getByTestId('monaco-editor-mock');
    fireEvent.change(editor, { target: { value: 'new code' } });
    expect(mockOnChange).toHaveBeenCalledWith('new code');
  });

  it('renders action buttons', () => {
    render(
      <CodeEditor
        value=""
        onChange={mockOnChange}
        onRun={jest.fn()}
        onReset={jest.fn()}
      />
    );
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });
});
