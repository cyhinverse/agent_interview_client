import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentModal } from '@/components/Admin/DocumentModal';
import {
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
} from '@/features/admin/adminApi';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';

jest.mock('@/features/admin/adminApi', () => ({
  useUploadDocumentMutation: jest.fn(),
  useUpdateDocumentMutation: jest.fn(),
}));

jest.mock('@/hooks/useInterviewCategories', () => ({
  useInterviewCategories: jest.fn(),
}));

describe('DocumentModal Component', () => {
  const mockUpload = jest
    .fn()
    .mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });
  const mockUpdate = jest
    .fn()
    .mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    (useUploadDocumentMutation as jest.Mock).mockReturnValue([
      mockUpload,
      { isLoading: false },
    ]);
    (useUpdateDocumentMutation as jest.Mock).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ]);
    (useInterviewCategories as jest.Mock).mockReturnValue({
      data: [{ id: 'cat1', name: 'Category 1' }],
    });
  });

  it('renders upload modal', () => {
    render(
      <DocumentModal
        isOpen={true}
        onClose={mockOnClose}
        document={null}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  it('renders edit modal', () => {
    const doc = {
      id: '1',
      title: 'Doc 1',
      categoryId: 'cat1',
      fileName: 'doc.pdf',
      fileType: 'pdf',
      fileSize: 1024,
      status: 'COMPLETED' as const,
      uploadedAt: '2023-01-01',
      chunks: [],
      totalChunks: 0,
    };
    render(
      <DocumentModal
        isOpen={true}
        onClose={mockOnClose}
        document={doc}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.getByText('Edit Document')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doc 1')).toBeInTheDocument();
  });
});
