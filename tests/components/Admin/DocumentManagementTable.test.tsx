import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentManagementTable } from '@/components/Admin/DocumentManagementTable';
import { useDeleteDocument } from '@/hooks/useAdmin';

jest.mock('@/hooks/useAdmin', () => ({
  useDeleteDocument: jest.fn(),
}));

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}));

describe('DocumentManagementTable Component', () => {
  const mockDelete = jest.fn().mockResolvedValue({});
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    (useDeleteDocument as jest.Mock).mockReturnValue({ mutate: mockDelete });
    window.confirm = jest.fn().mockReturnValue(true);
  });

  const mockDocs = [
    {
      id: '1',
      categoryId: 'cat1',
      category: { id: 'c1', name: 'Category 1', slug: 'cat-1' },
      title: 'Doc 1',
      fileName: 'doc.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      status: 'COMPLETED' as const,
      uploadedAt: '2023-01-01T00:00:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      chunks: [],
      totalChunks: 10,
    },
  ];

  it('renders table with documents', () => {
    render(
      <DocumentManagementTable documents={mockDocs} onRefresh={mockOnRefresh} />
    );
    // screen.debug();
    expect(screen.getByText('Doc 1')).toBeInTheDocument();
  });

  it('handles delete', async () => {
    render(
      <DocumentManagementTable documents={mockDocs} onRefresh={mockOnRefresh} />
    );

    // Find the delete button. It's the second button (Trash2 icon)
    // We can find by icon class if rendered, but testing-library recommends roles/labels
    // Since Tooltip has content "Delete", let's try to find the trigger button.
    // The button has `onClick={() => handleDelete(doc.id)}`.

    const buttons = screen.getAllByRole('button');
    // Assuming 2 buttons per row. row 1: [Edit, Delete]
    const deleteButton = buttons[1];

    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('1'));
  });
});
