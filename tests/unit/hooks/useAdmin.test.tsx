import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  useAdminStats,
  useInterviewCategories,
  useCreateInterviewCategory,
  useDeleteInterviewCategory,
  useUsers,
  useUpdateUserRole,
  useDeleteUser,
} from '@/hooks/useAdmin';
import adminReducer from '@/features/admin/adminSlice';
import authReducer from '@/features/auth/authSlice';
import { apiSlice } from '@/store/apiSlice';
import { toast } from 'sonner';

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Create a wrapper with Redux Provider
const createWrapper = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      admin: adminReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

// Mock the API mutations
const mockCreateCategory = jest.fn();
const mockDeleteCategory = jest.fn();
const mockUpdateUserRole = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock('@/features/admin/adminApi', () => ({
  useGetDashboardQuery: jest.fn(),
  useGetSystemStatsQuery: jest.fn(),
  useGetAllInterviewCategoriesQuery: jest.fn(),
  useCreateInterviewCategoryMutation: () => [
    mockCreateCategory,
    { isLoading: false },
  ],
  useUpdateInterviewCategoryMutation: jest.fn(),
  useDeleteInterviewCategoryMutation: () => [
    mockDeleteCategory,
    { isLoading: false },
  ],
  useGetAllDocumentsQuery: jest.fn(),
  useCreateDocumentMutation: jest.fn(),
  useUpdateDocumentMutation: jest.fn(),
  useDeleteDocumentMutation: jest.fn(),
  useGetAllSessionsQuery: jest.fn(),
  useGetSessionDetailsQuery: jest.fn(),
  useDeleteSessionMutation: jest.fn(),
  useGetAllResponsesQuery: jest.fn(),
  useUpdateResponseMutation: jest.fn(),
  useDeleteResponseMutation: jest.fn(),
}));

jest.mock('@/features/users/usersApi', () => ({
  useGetAllUsersQuery: jest.fn(),
  useUpdateUserRoleMutation: () => [mockUpdateUserRole, { isLoading: false }],
  useDeleteUserMutation: () => [mockDeleteUser, { isLoading: false }],
  useGetAllReportsQuery: jest.fn(),
  useUpdateReportMutation: jest.fn(),
  useDeleteReportMutation: jest.fn(),
}));

describe('useAdmin Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCreateInterviewCategory', () => {
    it('should create category successfully', async () => {
      mockCreateCategory.mockReturnValue({
        unwrap: () => Promise.resolve({ id: 'cat-1' }),
      });

      const { result } = renderHook(() => useCreateInterviewCategory(), {
        wrapper: createWrapper(),
      });

      const categoryData = {
        name: 'Technical',
        slug: 'technical',
        systemPrompt: 'You are a technical interviewer',
      };

      await act(async () => {
        await result.current.mutate(categoryData);
      });

      expect(mockCreateCategory).toHaveBeenCalledWith(categoryData);
      expect(toast.success).toHaveBeenCalledWith(
        'Category created successfully!'
      );
    });

    it('should handle creation error', async () => {
      mockCreateCategory.mockReturnValue({
        unwrap: () =>
          Promise.reject({ data: { message: 'Slug already exists' } }),
      });

      const { result } = renderHook(() => useCreateInterviewCategory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        try {
          await result.current.mutate({
            name: 'Test',
            slug: 'test',
            systemPrompt: '...',
          });
        } catch (e) {
          // Expected
        }
      });

      expect(toast.error).toHaveBeenCalledWith('Slug already exists');
    });
  });

  describe('useDeleteInterviewCategory', () => {
    it('should delete category successfully', async () => {
      mockDeleteCategory.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useDeleteInterviewCategory(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate('cat-123');
      });

      expect(mockDeleteCategory).toHaveBeenCalledWith('cat-123');
      expect(toast.success).toHaveBeenCalledWith(
        'Category deleted successfully!'
      );
    });
  });

  describe('User Management Hooks', () => {
    it('should update user role successfully', async () => {
      mockUpdateUserRole.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useUpdateUserRole(), {
        wrapper: createWrapper(),
      });

      const updateData = { userId: 'u-1', role: 'ADMIN' as const };

      await act(async () => {
        await result.current.mutate(updateData);
      });

      expect(mockUpdateUserRole).toHaveBeenCalledWith(updateData);
      expect(toast.success).toHaveBeenCalledWith(
        'User role updated successfully!'
      );
    });

    it('should delete user successfully', async () => {
      mockDeleteUser.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate('u-1');
      });

      expect(mockDeleteUser).toHaveBeenCalledWith('u-1');
      expect(toast.success).toHaveBeenCalledWith('User deleted successfully!');
    });
  });
});
