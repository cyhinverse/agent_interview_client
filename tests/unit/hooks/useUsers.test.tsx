import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useUpdateUser, useChangePassword, useLogout } from '@/hooks/useUsers';
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

// Mock redux hooks if needed, but we use real store here
const mockDispatch = jest.fn();
jest.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

// Mock queries and mutations
const mockUpdateUserMutationFn = jest.fn();
const mockChangePasswordMutationFn = jest.fn();

jest.mock('@/features/users/usersApi', () => ({
  useGetCurrentUserQuery: () => ({
    data: { id: '1', fullName: 'John Doe' },
    isLoading: false,
  }),
  useGetUserStatsQuery: jest.fn(),
  useGetUserReportsQuery: jest.fn(),
  useGetReportByIdQuery: jest.fn(),
  useGetSessionReportQuery: jest.fn(),
  useUpdateUserMutation: () => [mockUpdateUserMutationFn, { isLoading: false }],
  useChangePasswordMutation: () => [
    mockChangePasswordMutationFn,
    { isLoading: false },
  ],
}));

// Create a wrapper with Redux Provider
const createWrapper = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(apiSlice.middleware),
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useUsers Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUpdateUser', () => {
    it('should update profile successfully', async () => {
      mockUpdateUserMutationFn.mockReturnValue({
        unwrap: () => Promise.resolve({ id: '1', fullName: 'Updated Name' }),
      });

      const { result } = renderHook(() => useUpdateUser(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate({ fullName: 'Updated Name' });
      });

      expect(mockUpdateUserMutationFn).toHaveBeenCalledWith({
        fullName: 'Updated Name',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Profile updated successfully!'
      );
    });
  });

  describe('useChangePassword', () => {
    it('should change password successfully', async () => {
      mockChangePasswordMutationFn.mockReturnValue({
        unwrap: () => Promise.resolve({ success: true }),
      });

      const { result } = renderHook(() => useChangePassword(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate({
          currentPassword: 'old',
          newPassword: 'new',
        });
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Password changed successfully!'
      );
    });
  });

  describe('useLogout', () => {
    it('should handle logout successfully', async () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutate();
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
    });
  });
});
