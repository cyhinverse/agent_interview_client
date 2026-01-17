import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryManagementTable } from '@/components/Admin/CategoryManagementTable';
import { useDeleteInterviewCategory } from '@/hooks/useAdmin';

// Mock the hook
jest.mock('@/hooks/useAdmin', () => ({
  useDeleteInterviewCategory: jest.fn(),
}));

// Mock window.confirm
window.confirm = jest.fn();

describe('CategoryManagementTable', () => {
  const mockCategories = [
    {
      id: '1',
      name: 'Frontend',
      slug: 'frontend',
      language: 'English',
      createdAt: '2023-01-01T00:00:00.000Z',
      systemPrompt: 'FP',
    },
    {
      id: '2',
      name: 'Backend',
      slug: 'backend',
      language: 'English',
      createdAt: '2023-02-01T00:00:00.000Z',
      systemPrompt: 'BP',
    },
  ];

  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteInterviewCategory as jest.Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  it('should render loading state', () => {
    render(<CategoryManagementTable categories={[]} isLoading={true} />);
    expect(screen.getByText(/loading categories/i)).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<CategoryManagementTable categories={[]} isLoading={false} />);
    expect(screen.getByText(/no categories found/i)).toBeInTheDocument();
  });

  it('should render categories correctly', () => {
    render(<CategoryManagementTable categories={mockCategories} />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('backend')).toBeInTheDocument();

    // Check for languages (in badges)
    const badges = screen.getAllByText('English');
    expect(badges.length).toBe(2);
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(
      <CategoryManagementTable categories={mockCategories} onEdit={onEdit} />
    );

    // In each row, the first button is Edit, the second is Delete
    const editButtons = screen.getAllByRole('button');

    // We expect 2 buttons per category + 1 toggle button in sidebar if it were there,
    // but here we only render the table. So 2 buttons * 2 categories = 4 buttons.
    // Index 0 is first category Edit, Index 1 is first category Delete.
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('should call delete mutation when trash button is clicked and confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    const onRefresh = jest.fn();

    render(
      <CategoryManagementTable
        categories={mockCategories}
        onRefresh={onRefresh}
      />
    );

    const buttons = screen.getAllByRole('button');
    // Index 1 is the Delete button for the first category
    fireEvent.click(buttons[1]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutate).toHaveBeenCalledWith('1');

    await waitFor(() => {
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  it('should not call delete mutation if not confirmed', () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<CategoryManagementTable categories={mockCategories} />);

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) =>
        btn.querySelector('svg')?.classList.contains('lucide-trash2')
      );

    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
